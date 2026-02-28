package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"rentals-service/controllers"
	"rentals-service/routes"

	"github.com/gorilla/handlers"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	client, _ := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client.Connect(ctx)

	controllers.RentalCollection = client.Database("krishi").Collection("rentals")

	// Run seeder ONCE
	// SeedRentals(controllers.RentalCollection)

	r := routes.RentalRoutes()

	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	fmt.Println("server running on 8095")
	http.ListenAndServe(":8095", cors(r))
}
