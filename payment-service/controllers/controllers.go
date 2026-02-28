package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"payment-service/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/checkout/session"
)

type PaymentController struct {
	JwtKey []byte
}

// 🔐 VERIFY JWT
func (pc *PaymentController) VerifyToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("Missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return pc.JwtKey, nil
	})

	if err != nil || !token.Valid {
		return "", fmt.Errorf("Invalid token: %v", err)
	}

	userId, ok := claims["userId"].(string)
	if !ok {
		return "", fmt.Errorf("userId missing in token")
	}

	return userId, nil
}

// 🎟️ VERIFY SESSION
func (pc *PaymentController) VerifySession(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session_id")
	if sessionID == "" {
		http.Error(w, "Missing session_id", http.StatusBadRequest)
		return
	}

	stripe.Key = os.Getenv("SECRET_KEY")

	s, err := session.Get(sessionID, nil)
	if err != nil {
		http.Error(w, "Failed to retrieve session", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(s)
}

// 💳 CREATE CHECKOUT SESSION
// 💳 CREATE CHECKOUT SESSION
func (pc *PaymentController) CreateCheckoutSession(w http.ResponseWriter, r *http.Request) {

	// Validate JWT
	userId, err := pc.VerifyToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var body models.CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	if len(body.Items) == 0 {
		http.Error(w, "No items provided", http.StatusBadRequest)
		return
	}

	// Stripe setup
	stripe.Key = os.Getenv("SECRET_KEY")

	var lineItems []*stripe.CheckoutSessionLineItemParams

	for _, item := range body.Items {
		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String("inr"),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name: stripe.String(item.Title),
				},
				UnitAmount: stripe.Int64(int64(item.Price * 100)),
			},
			Quantity: stripe.Int64(item.Quantity),
		})
	}

	// Decide success URL
	successURL := ""
	if body.Mode == "cart" {
		successURL = "http://localhost:5173/cart-success?session_id={CHECKOUT_SESSION_ID}"
	} else {
		successURL = "http://localhost:5173/booking-success?session_id={CHECKOUT_SESSION_ID}"
	}

	// Metadata based on mode
	metadata := map[string]string{
		"userId": userId,
		"mode":   body.Mode,
	}

	if body.Mode == "booking" {
		rData := body.RideData
		metadata["vehicleName"] = rData.VehicleName
		metadata["vehicleCategory"] = rData.VehicleCategory
		metadata["pickup"] = rData.Pickup
		metadata["destination"] = rData.Destination
		metadata["days"] = strconv.Itoa(rData.Days)
		metadata["partnerName"] = rData.PartnerName
		metadata["totalFare"] = strconv.Itoa(rData.TotalFare)
	}

	// Create Stripe session
	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems:          lineItems,
		Mode:               stripe.String("payment"),
		SuccessURL:         stripe.String(successURL),
		CancelURL:          stripe.String("http://localhost:5173/payment-cancel"),
		Metadata:           metadata,
	}

	s, err := session.New(params)
	if err != nil {
		http.Error(w, fmt.Sprintf("Stripe error: %v", err), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"url": s.URL})
}
