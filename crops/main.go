package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	cropController "crops/controllers"
	"crops/routes"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(204)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client.Connect(ctx)

	db := client.Database("krishi")
	cropCollection := db.Collection("crops")

	controller := &cropController.CropController{Collection: cropCollection}

	mux := http.NewServeMux()
	routes.CropRoutes(controller, mux)

	fmt.Println("🚀 Crop service running on :8000")
	http.ListenAndServe(":8000", corsMiddleware(mux))
}
