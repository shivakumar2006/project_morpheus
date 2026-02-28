package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"pulses/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type PulseController struct {
	Collection *mongo.Collection
}

func (pc *PulseController) GetPulses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := pc.Collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch pulses", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var pulses []models.Pulse
	if err := cursor.All(ctx, &pulses); err != nil {
		http.Error(w, "Error parsing pulses", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(pulses)
}

func (pc *PulseController) GetPulseById(w http.ResponseWriter, r *http.Request) {
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

	var pulse models.Pulse
	err = pc.Collection.FindOne(ctx, bson.M{"_id": id}).Decode(&pulse)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Pulse not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching pulse", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(pulse)
}

func (pc *PulseController) SeedPulses(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile("data/pulses.json")
	if err != nil {
		http.Error(w, "Cannot read json", http.StatusInternalServerError)
		return
	}

	var jsonData map[string][]models.Pulse
	if err := json.Unmarshal(data, &jsonData); err != nil {
		http.Error(w, "Invalid JSON file", http.StatusInternalServerError)
		return
	}

	pulses, ok := jsonData["pulses"]
	if !ok {
		http.Error(w, "No pulses key in json", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	docs := make([]interface{}, len(pulses))
	for i, v := range pulses {
		docs[i] = v
	}

	_, err = pc.Collection.InsertMany(ctx, docs)
	if err != nil {
		http.Error(w, "Error inserting pulses", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Pulses seeded successfully"))
}
