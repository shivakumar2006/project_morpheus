package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"cart/models" // <-- change to your module path

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CartController struct {
	Collection        *mongo.Collection
	JwtKey            []byte
	VegetableSvcURL   string
	PulseSvcURL       string
	FruitSvcURL       string
	CropSvcURL        string
	EssentialSvcURL   string
	HTTPClient        *http.Client
	PlatformFeeAmount float64
}

// NewCartController helper to create controller (call from main)
func NewCartController(col *mongo.Collection, jwtSecret []byte) *CartController {
	client := &http.Client{Timeout: 5 * time.Second}
	return &CartController{
		Collection:        col,
		JwtKey:            jwtSecret,
		VegetableSvcURL:   getEnv("VEGETABLE_URL", "http://localhost:8001"),
		PulseSvcURL:       getEnv("PULSE_URL", "http://localhost:8003"),
		FruitSvcURL:       getEnv("FRUIT_URL", "http://localhost:8002"),
		CropSvcURL:        getEnv("CROP_URL", "http://localhost:8000"),
		EssentialSvcURL:   getEnv("ESSENTIAL_URL", "http://localhost:8090"),
		HTTPClient:        client,
		PlatformFeeAmount: 20.0,
	}
}

// small env helper
func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// VerifyToken returns userId from JWT or error
func (cc *CartController) VerifyToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("missing authorization header")
	}
	tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if tokenString == "" {
		return "", fmt.Errorf("missing token")
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return cc.JwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token: %v", err)
	}

	// Expecting claim "userId"
	if uid, ok := claims["userId"].(string); ok && uid != "" {
		return uid, nil
	}
	// fallback to "sub"
	if sub, ok := claims["sub"].(string); ok && sub != "" {
		return sub, nil
	}
	return "", fmt.Errorf("userId missing in token")
}

// request payload for add
type addPayload struct {
	ItemID   string  `json:"itemId"`
	Service  string  `json:"service"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Image    string  `json:"image"`
	Category string  `json:"category"`
	Quantity int     `json:"quantity"`
}

// AddToCart: POST /cart/add
// Accepts a full item payload (frontend sends full item). Verifies with source service, then upserts into cart.
func (cc *CartController) AddToCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, `{"success":false,"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var p addPayload
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, `{"success":false,"error":"invalid body"}`, http.StatusBadRequest)
		return
	}

	// basic validation
	if p.ItemID == "" || p.Service == "" || p.Name == "" || p.Quantity <= 0 {
		http.Error(w, `{"success":false,"error":"missing required fields or quantity <= 0"}`, http.StatusBadRequest)
		return
	}

	// Verify with source service: fetch canonical item and compare price/name/image/category as applicable
	ok, svcItem, svcErr := cc.verifyWithSource(p.Service, p.ItemID)
	if !ok || svcErr != nil {
		// If verification fails, reject
		msg := "verification failed"
		if svcErr != nil {
			msg = svcErr.Error()
		}
		http.Error(w, fmt.Sprintf(`{"success":false,"error":"%s"}`, msg), http.StatusBadRequest)
		return
	}

	// Optionally compare price/name: we will override some fields with canonical ones to be safe
	// Map canonical svcItem into our fields (svcItem may vary by service)
	// svcItem map will include keys: name, price, image, category (if available)
	if v, ok := svcItem["name"].(string); ok && v != "" {
		p.Name = v
	}
	if v, ok := svcItem["price"].(float64); ok {
		p.Price = v
	} else if vi, ok := svcItem["price_int"].(int); ok {
		p.Price = float64(vi)
	}
	// image
	if v, ok := svcItem["image"].(string); ok && v != "" {
		p.Image = v
	}
	// category (may be empty for essentials)
	if v, ok := svcItem["category"].(string); ok && v != "" {
		p.Category = v
	}

	collection := cc.Collection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Upsert behavior: if user already has this item (same itemId + service) -> increment quantity
	filter := bson.M{"userId": userId, "itemId": p.ItemID, "service": p.Service}
	update := bson.M{
		"$inc": bson.M{"quantity": p.Quantity},
		"$set": bson.M{
			"name":     p.Name,
			"price":    p.Price,
			"image":    p.Image,
			"category": p.Category,
		},
	}
	opts := options.Update().SetUpsert(true)
	res, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		http.Error(w, `{"success":false,"error":"db error"}`, http.StatusInternalServerError)
		return
	}

	// If newly inserted (UpsertedCount==1) need to set fields properly (because $inc with upsert sets quantity but other fields need to be set)
	if res.UpsertedCount > 0 {
		// set the fields in case of insert: UpdateOne with $inc and $set should have created doc with provided fields, but to be safe do an update with $setOnInsert too (already handled by SetUpsert with $set? we ensure now)
		collection.UpdateOne(ctx, filter, bson.M{"$setOnInsert": bson.M{
			"userId":   userId,
			"itemId":   p.ItemID,
			"service":  p.Service,
			"name":     p.Name,
			"price":    p.Price,
			"image":    p.Image,
			"category": p.Category,
		}})
	}

	// Return updated cart
	cc.respondCartForUser(w, userId)
}

// verifyWithSource calls the appropriate microservice to get canonical item data.
// Returns map[string]interface{} with keys name, price (float64), image, category (if any).
func (cc *CartController) verifyWithSource(service, itemId string) (bool, map[string]interface{}, error) {
	var url string
	switch strings.ToLower(service) {
	case "vegetable", "vegetables":
		// endpoint: GET /vegetable?id=26
		url = fmt.Sprintf("%s/vegetable?id=%s", cc.VegetableSvcURL, itemId)
	case "pulse", "pulses":
		url = fmt.Sprintf("%s/pulse?id=%s", cc.PulseSvcURL, itemId)
	case "fruit", "fruits":
		url = fmt.Sprintf("%s/fruit?id=%s", cc.FruitSvcURL, itemId)
	case "crop", "crops":
		url = fmt.Sprintf("%s/crop?id=%s", cc.CropSvcURL, itemId)
	case "essential", "farmeressen", "farmeressen-service":
		url = fmt.Sprintf("%s/products?prod_id=%s", cc.EssentialSvcURL, itemId)
	default:
		return false, nil, fmt.Errorf("unknown service: %s", service)
	}

	// do GET with context and http client
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return false, nil, err
	}

	resp, err := cc.HTTPClient.Do(req)
	if err != nil {
		return false, nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, nil, fmt.Errorf("source service returned status %d", resp.StatusCode)
	}

	// decode according to service response shape (object or array)
	var raw interface{}
	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return false, nil, err
	}

	var out map[string]interface{}

	switch val := raw.(type) {

	case map[string]interface{}:
		// normal services return a single object
		out = val

	case []interface{}:
		// essentials returns an array → pick first element
		if len(val) == 0 {
			return false, nil, fmt.Errorf("empty array received from service")
		}

		firstItem, ok := val[0].(map[string]interface{})
		if !ok {
			return false, nil, fmt.Errorf("unexpected array format from service")
		}

		out = firstItem

	default:
		return false, nil, fmt.Errorf("invalid response structure from service")
	}

	// Normalize into canonical fields: name, price (float64), image, category
	canon := map[string]interface{}{}

	// For vegetables/pulses/fruits/crops sample JSON uses _id (int), name, price, image, category maybe
	if name, ok := out["name"].(string); ok {
		canon["name"] = name
	}
	// price might be float64 (json decodes numbers to float64) or int; handle both
	if price, ok := out["price"].(float64); ok {
		canon["price"] = price
	} else if priceInt, ok := out["price"].(int); ok {
		canon["price"] = float64(priceInt)
	} else if priceNum, ok := out["price"].(json.Number); ok {
		f, _ := priceNum.Float64()
		canon["price"] = f
	}

	// image or imageUrl
	if img, ok := out["image"].(string); ok && img != "" {
		canon["image"] = img
	} else if img2, ok := out["imageUrl"].(string); ok && img2 != "" {
		canon["image"] = img2
	}

	// category
	if cat, ok := out["category"].(string); ok {
		canon["category"] = cat
	}

	return true, canon, nil
}

// respondCartForUser fetches all cart items for user and writes aggregated response
func (cc *CartController) respondCartForUser(w http.ResponseWriter, userId string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := cc.Collection.Find(ctx, bson.M{"userId": userId})
	if err != nil {
		http.Error(w, `{"success":false,"error":"db error"}`, http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var items []models.CartItem
	if err := cursor.All(ctx, &items); err != nil {
		http.Error(w, `{"success":false,"error":"db error"}`, http.StatusInternalServerError)
		return
	}

	// build response items with itemTotal
	type respItem struct {
		ItemID    string  `json:"itemId"`
		Service   string  `json:"service"`
		Name      string  `json:"name"`
		Price     float64 `json:"price"`
		Image     string  `json:"image"`
		Category  string  `json:"category"`
		Quantity  int     `json:"quantity"`
		ItemTotal float64 `json:"itemTotal"`
	}

	var respItems []respItem
	var subtotal float64
	var totalQty int
	for _, it := range items {
		itemTotal := float64(it.Quantity) * it.Price
		subtotal += itemTotal
		totalQty += it.Quantity

		respItems = append(respItems, respItem{
			ItemID:    it.ItemID,
			Service:   it.Service,
			Name:      it.Name,
			Price:     it.Price,
			Image:     it.Image,
			Category:  it.Category,
			Quantity:  it.Quantity,
			ItemTotal: itemTotal,
		})
	}

	final := subtotal + cc.PlatformFeeAmount

	respObj := map[string]interface{}{
		"success":       true,
		"items":         respItems,
		"totalQuantity": totalQty,
		"subtotal":      subtotal,
		"platformFee":   cc.PlatformFeeAmount,
		"finalAmount":   final,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(respObj)
}

// GetCart: GET /cart
func (cc *CartController) GetCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, `{"success":false,"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}
	cc.respondCartForUser(w, userId)
}

// UpdateQuantity: PATCH /cart/increase and /cart/decrease (query param itemId)
func (cc *CartController) UpdateQuantity(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, `{"success":false,"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r) // not used but kept for future
	_ = vars

	// We accept query params: itemId and service (service optional if you store unique itemId across services)
	itemId := r.URL.Query().Get("itemId")
	if itemId == "" {
		http.Error(w, `{"success":false,"error":"missing itemId"}`, http.StatusBadRequest)
		return
	}
	action := r.URL.Query().Get("action") // "inc" or "dec" - alternative to separate routes
	if action == "" {
		http.Error(w, `{"success":false,"error":"missing action (inc/dec)"}`, http.StatusBadRequest)
		return
	}

	change := 0
	if action == "inc" {
		change = 1
	} else if action == "dec" {
		change = -1
	} else {
		http.Error(w, `{"success":false,"error":"invalid action"}`, http.StatusBadRequest)
		return
	}

	// update doc
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// find current item
	var current models.CartItem
	err = cc.Collection.FindOne(ctx, bson.M{"userId": userId, "itemId": itemId}).Decode(&current)
	if err != nil {
		http.Error(w, `{"success":false,"error":"item not found"}`, http.StatusNotFound)
		return
	}

	newQty := current.Quantity + change
	if newQty <= 0 {
		_, err := cc.Collection.DeleteOne(ctx, bson.M{"userId": userId, "itemId": itemId})
		if err != nil {
			http.Error(w, `{"success":false,"error":"db delete error"}`, http.StatusInternalServerError)
			return
		}
		cc.respondCartForUser(w, userId)
		return
	}

	_, err = cc.Collection.UpdateOne(ctx,
		bson.M{"userId": userId, "itemId": itemId},
		bson.M{"$set": bson.M{"quantity": newQty}},
	)
	if err != nil {
		http.Error(w, `{"success":false,"error":"db update error"}`, http.StatusInternalServerError)
		return
	}

	cc.respondCartForUser(w, userId)
}

// RemoveFromCart: DELETE /cart/remove?itemId=...
func (cc *CartController) RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, `{"success":false,"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	itemId := r.URL.Query().Get("itemId")
	if itemId == "" {
		http.Error(w, `{"success":false,"error":"missing itemId"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = cc.Collection.DeleteOne(ctx, bson.M{"userId": userId, "itemId": itemId})
	if err != nil {
		http.Error(w, `{"success":false,"error":"db delete error"}`, http.StatusInternalServerError)
		return
	}

	cc.respondCartForUser(w, userId)
}

// ClearCart: DELETE /cart/clear
func (cc *CartController) ClearCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, `{"success":false,"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = cc.Collection.DeleteMany(ctx, bson.M{"userId": userId})
	if err != nil {
		http.Error(w, `{"success":false,"error":"db delete error"}`, http.StatusInternalServerError)
		return
	}

	cc.respondCartForUser(w, userId)
}
