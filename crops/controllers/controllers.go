package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"crops/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CropController struct {
	Collection *mongo.Collection
}

// GET ALL CROPS
func (cc *CropController) GetAllCrops(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := cc.Collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	var crops []models.Crop

	if err := cursor.All(ctx, &crops); err != nil {
		http.Error(w, "Error parsing crops", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(crops)
}

// GET CROP BY ID
func (cc *CropController) GetCropById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Id missing", http.StatusBadRequest)
		return
	}

	id, _ := strconv.Atoi(idStr)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var crop models.Crop
	err := cc.Collection.FindOne(ctx, bson.M{"_id": id}).Decode(&crop)
	if err != nil {
		http.Error(w, "Crop not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(crop)
}

// GET BY CATEGORY
func (cc *CropController) GetCropsByCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	category := r.URL.Query().Get("category")
	if category == "" {
		http.Error(w, "Category missing", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := cc.Collection.Find(ctx, bson.M{"category": category})
	if err != nil {
		http.Error(w, "Failed to fetch category crops", http.StatusInternalServerError)
		return
	}

	var crops []models.Crop
	cursor.All(ctx, &crops)

	json.NewEncoder(w).Encode(crops)
}

// SEED FROM JSON FILE
func (cc *CropController) SeedCrops(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile("data/crops.json")
	if err != nil {
		http.Error(w, "Cannot read json", http.StatusInternalServerError)
		return
	}

	var jsonData map[string][]models.Crop
	json.Unmarshal(data, &jsonData)

	crops := jsonData["crops"]

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	docs := make([]interface{}, len(crops))
	for i, v := range crops {
		docs[i] = v
	}

	_, err = cc.Collection.InsertMany(ctx, docs)
	if err != nil {
		http.Error(w, "Error inserting", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Seeded Successfully"))
}
