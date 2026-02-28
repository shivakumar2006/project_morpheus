package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"vegetable-service/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type VegetableController struct {
	Collection *mongo.Collection
}

// get all vegetables
func (vc *VegetableController) GetAllVegetables(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := vc.Collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch vegetables", http.StatusInternalServerError)
		return
	}

	var vegetables []models.Vegetable
	if err := cursor.All(ctx, &vegetables); err != nil {
		http.Error(w, "Error parsing vegetables", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(vegetables)
}

func (vc *VegetableController) GetVegetableById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Id missing", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var vegetable models.Vegetable

	err = vc.Collection.FindOne(ctx, bson.M{"_id": id}).Decode(&vegetable)
	if err != nil {
		http.Error(w, "Vegetable not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(vegetable)
}

func (vc *VegetableController) GetVegetablesByCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	category := r.URL.Query().Get("category")
	if category == "" {
		http.Error(w, "Category missing", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := vc.Collection.Find(ctx, bson.M{"category": category})
	if err != nil {
		http.Error(w, "Filed to fetch category vegetables", http.StatusInternalServerError)
		return
	}

	var vegetables []models.Vegetable
	cursor.All(ctx, &vegetables)

	json.NewEncoder(w).Encode(vegetables)
}

func (vc *VegetableController) SeedVegetables(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile("data/vegetables.json")
	if err != nil {
		http.Error(w, "Cannot read json", http.StatusInternalServerError)
		return
	}

	var jsonData map[string][]models.Vegetable
	json.Unmarshal(data, &jsonData)

	vegetables := jsonData["vegetables"]

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	docs := make([]interface{}, len(vegetables))
	for i, v := range vegetables {
		docs[i] = v
	}

	_, err = vc.Collection.InsertMany(ctx, docs)
	if err != nil {
		http.Error(w, "Error inserting vegetables", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("VEgetable seeded successfully"))
}
