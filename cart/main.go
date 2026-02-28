package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"cart/controllers" // <-- CHANGE THIS
	"cart/routes"      // <-- CHANGE THIS

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	// 1) Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ No .env file found, using system environment variables.")
	}

	// 2) Read JWT secret
	JWT_SECRET := os.Getenv("JWT_SECRET")
	if JWT_SECRET == "" {
		log.Fatal("❌ ERROR: JWT_SECRET is not set in environment!")
	}

	// 3) MongoDB connection -----------------------------
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	log.Println("📡 Connecting to MongoDB...")
	clientOptions := options.Client().ApplyURI(mongoURI)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("❌ MongoDB connection failed:", err)
	}

	// Choose database + collection
	db := client.Database("krishi")         // 🍃 Change DB name if you want
	cartCollection := db.Collection("cart") // our cart collection

	log.Println("✅ MongoDB connected!")

	// 4) Initialize Controller --------------------------------
	cc := controllers.NewCartController(cartCollection, []byte(JWT_SECRET))

	// 5) HTTP Router ------------------------------------------
	router := mux.NewRouter()
	routes.RegisterCartRoutes(router, cc)

	// 6) CORS SETUP -------------------------------------------
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // React dev port
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	// 7) Start Server -----------------------------------------
	log.Println("🚀 KRISHI Cart Service is running on port :8008")
	err = http.ListenAndServe(":8008", handler)
	if err != nil {
		log.Fatal("❌ Server crashed:", err)
	}
}
