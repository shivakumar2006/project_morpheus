package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	fruitController "fruits/controllers"
	"fruits/routes"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // change in prod
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// MongoDB client
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Mongo NewClient error:", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := client.Connect(ctx); err != nil {
		log.Fatal("Mongo connect error:", err)
	}

	// Test ping (optional)
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Mongo ping error:", err)
	}

	db := client.Database("krishi")
	fruitCollection := db.Collection("fruits")

	controller := &fruitController.FruitController{Collection: fruitCollection}

	mux := http.NewServeMux()
	routes.FruitRoutes(controller, mux)

	handler := corsMiddleware(mux)

	fmt.Println("🚀 Fruit microservice running at :8002")
	srv := &http.Server{
		Addr:         ":8002",
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Fatal("Server error:", err)
	}
}
