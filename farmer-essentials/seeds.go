package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"time"

	"farmer-esentials/models"

	"go.mongodb.org/mongo-driver/mongo"
)

func SeedProducts(collection *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	// Read JSON file
	jsonData, err := ioutil.ReadFile("data/tools.json")
	if err != nil {
		log.Fatal("Failed to read tools.json:", err)
	}

	// Decode into map[string][]Product
	var data map[string][]models.Product
	if err := json.Unmarshal(jsonData, &data); err != nil {
		log.Fatal("Failed to decode JSON:", err)
	}

	// Flatten for MongoDB insertion
	var products []interface{}

	for category, items := range data {
		for _, item := range items {
			item.Category = category
			products = append(products, item)
		}
	}

	// Insert into MongoDB
	result, err := collection.InsertMany(ctx, products)
	if err != nil {
		log.Fatal("Insert error:", err)
	}

	fmt.Println("Inserted products:", len(result.InsertedIDs))
}
