package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"coldstorage/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var ColdStorageCollection *mongo.Collection

func GetColdStorages(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := ColdStorageCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	var storages []models.ColdStorage
	if err := cursor.All(ctx, &storages); err != nil {
		http.Error(w, "Error reading data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(storages)
}
