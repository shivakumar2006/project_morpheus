package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	pulseController "pulses/controllers"
	routes "pulses/routes"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Mongo client error:", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := client.Connect(ctx); err != nil {
		log.Fatal("Mongo connect error:", err)
	}

	db := client.Database("krishi")
	pulseCollection := db.Collection("pulses")

	controller := &pulseController.PulseController{Collection: pulseCollection}

	mux := http.NewServeMux()
	routes.PulseRoutes(controller, mux)

	handler := corsMiddleware(mux)

	fmt.Println("🚀 Pulses microservice running at :8003")

	server := &http.Server{
		Addr:    ":8003",
		Handler: handler,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server error:", err)
	}
}
