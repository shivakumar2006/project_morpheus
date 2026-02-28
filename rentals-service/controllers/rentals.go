package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"rentals-service/models"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var RentalCollection *mongo.Collection

// GET ALL RENTALS
func GetAllRentals(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := RentalCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	var rentals []models.Rental
	cursor.All(ctx, &rentals)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rentals)
}

// GET BY CATEGORY
func GetRentalsByCategory(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := RentalCollection.Find(ctx, bson.M{"category": category})
	if err != nil {
		http.Error(w, "Failed to fetch category", http.StatusInternalServerError)
		return
	}

	var rentals []models.Rental
	cursor.All(ctx, &rentals)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rentals)
}

// GET BY ID
// GET BY ID
func GetRentalByID(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]

	id, err := strconv.Atoi(idParam) // ✅ INT conversion
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var rental models.Rental
	err = RentalCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&rental)

	if err != nil {
		http.Error(w, "Vehicle not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rental)
}
