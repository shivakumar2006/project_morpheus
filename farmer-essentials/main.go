package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"farmer-esentials/controllers"
	"farmer-esentials/routes"

	"github.com/gorilla/handlers"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client.Connect(ctx)

	log.Println("Connected to MongoDB!")

	controllers.ProductCollection = client.Database("krishi").Collection("products")

	// ------------------------------
	// RUN SEED ONLY ONE TIME
	// ------------------------------
	// SeedProducts(controllers.ProductCollection)
	// ------------------------------
	// After seeding, comment it:
	// // SeedProducts(controllers.ProductCollection)
	// ------------------------------

	r := routes.ProductRoutes()

	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	log.Println("Product Service running at http://localhost:8090")
	http.ListenAndServe(":8090", cors(r))
}
