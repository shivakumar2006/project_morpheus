package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"coldstorage/controllers"
	"coldstorage/routes"

	"github.com/gorilla/handlers"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	// Connect to MongoDB
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to MongoDB!")

	// Assign collection
	controllers.ColdStorageCollection = client.Database("krishi").Collection("cold_storages")

	// Routes
	r := routes.ColdStorageRoutes()

	// CORS
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	log.Println("Cold Storage Service running at http://localhost:8085")
	http.ListenAndServe(":8085", cors(r))
}
