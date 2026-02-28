package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"farmer-esentials/models"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var ProductCollection *mongo.Collection

// GET ALL PRODUCTS
func GetAllProducts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := ProductCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	var products []models.Product
	if err := cursor.All(ctx, &products); err != nil {
		http.Error(w, "Error reading data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// GET PRODUCTS BY CATEGORY
func GetProductsByCategory(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := ProductCollection.Find(ctx, bson.M{"category": category})
	if err != nil {
		http.Error(w, "Failed to fetch category data", http.StatusInternalServerError)
		return
	}

	var products []models.Product
	if err := cursor.All(ctx, &products); err != nil {
		http.Error(w, "Error decoding", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// GET PRODUCT BY ID
func GetProductByID(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"] // URL se id
	objID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var product models.Product
	err = ProductCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&product)

	if err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}
