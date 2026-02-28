package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"auth/models"

	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var UserCollection *mongo.Collection

var JwtKey []byte

type SignupReq struct {
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
	Role            string `json:"role"`
}

func Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req SignupReq
	json.NewDecoder(r.Body).Decode(&req)

	if req.Password != req.ConfirmPassword {
		http.Error(w, "Password do not match", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// check existing
	count, _ := UserCollection.CountDocuments(ctx, bson.M{"email": req.Email})
	if count > 0 {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	user := models.User{
		ID:        primitive.NewObjectID(),
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Phone:     req.Phone,
		Password:  string(hashed),
		Role:      req.Role,
	}

	_, err := UserCollection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID.Hex(),
		"role":   user.Role,
		"exp":    time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenStr, _ := token.SignedString(JwtKey)

	user.Password = ""
	json.NewEncoder(w).Encode(map[string]any{"token": tokenStr, "user": user})
}

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginReq
	json.NewDecoder(r.Body).Decode(&req)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := UserCollection.FindOne(ctx, bson.M{"email": req.Email, "role": req.Role}).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid email or role", http.StatusUnauthorized)
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID.Hex(),
		"role":   user.Role,
		"exp":    time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenStr, _ := token.SignedString(JwtKey)

	user.Password = ""
	json.NewEncoder(w).Encode(map[string]any{"token": tokenStr, "user": user})
}

func VerifyToken(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth == "" {
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	var tokenStr string
	fmt.Sscanf(auth, "Bearer %s", &tokenStr)

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) { return JwtKey, nil })
	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	userId := claims["userId"].(string)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	oid, _ := primitive.ObjectIDFromHex(userId)
	UserCollection.FindOne(ctx, bson.M{"_id": oid}).Decode(&user)
	user.Password = ""

	json.NewEncoder(w).Encode(map[string]any{"valid": true, "user": user})
}
