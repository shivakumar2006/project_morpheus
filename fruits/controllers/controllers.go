package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"fruits/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type FruitController struct {
	Collection *mongo.Collection
}

func (fc *FruitController) GetFruits(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := fc.Collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch fruit", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var fruits []models.Fruit
	if err := cursor.All(ctx, &fruits); err != nil {
		http.Error(w, "Error parsing fruits", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(fruits)
}

func (fc *FruitController) GetFruitById(w http.ResponseWriter, r *http.Request) {
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

	var fruits models.Fruit
	err = fc.Collection.FindOne(ctx, bson.M{"_id": id}).Decode(&fruits)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Fruits not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching fruit", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(fruits)
}

func (fc *FruitController) GetFruitsByCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	category := r.URL.Query().Get("category")
	if category == "" {
		http.Error(w, "Category missing", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := fc.Collection.Find(ctx, bson.M{"category": category})
	if err != nil {
		http.Error(w, "Failed to fetch category fruits", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var fruits []models.Fruit
	if err := cursor.All(ctx, &fruits); err != nil {
		http.Error(w, "Cannot reaf files", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(fruits)
}

func (fc *FruitController) SeedFruit(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile("data/fruits.json")
	if err != nil {
		http.Error(w, "Cannot read json", http.StatusInternalServerError)
		return
	}

	var jsonData map[string][]models.Fruit
	if err := json.Unmarshal(data, &jsonData); err != nil {
		http.Error(w, "Invalid json file", http.StatusInternalServerError)
		return
	}

	fruits, ok := jsonData["fruits"]
	if !ok {
		http.Error(w, "No fruits key in json", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	docs := make([]interface{}, len(fruits))
	for i, v := range fruits {
		docs[i] = v
	}

	_, err = fc.Collection.InsertMany(ctx, docs)
	if err != nil {
		http.Error(w, "Error inserting fruits", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Fruits seeded successfully"))
}
