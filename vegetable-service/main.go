package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"vegetable-service/controllers"
	"vegetable-service/routes"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(204)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	// MONGO CONNECT
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}

	db := client.Database("krishi")
	vegCollection := db.Collection("vegetables")

	controller := &controllers.VegetableController{Collection: vegCollection}

	mux := http.NewServeMux()
	routes.VegetableRoutes(controller, mux)

	handler := corsMiddleware(mux)

	fmt.Println("🥦 Vegetables Microservice running on :8001")
	http.ListenAndServe(":8001", handler)
}
