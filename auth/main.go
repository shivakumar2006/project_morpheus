package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"auth/controllers"
	"auth/routes"

	"github.com/gorilla/handlers"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	godotenv.Load()

	controllers.JwtKey = []byte(os.Getenv("JWT_SECRET"))

	mongoURI := "mongodb://localhost:27017"
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	controllers.UserCollection = client.Database("krishi").Collection("users")

	r := routes.Router()

	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST"}),
	)

	log.Println("Server running on :8080")
	http.ListenAndServe(":8080", cors(r))
}
