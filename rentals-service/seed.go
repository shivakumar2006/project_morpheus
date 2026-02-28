package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"time"

	"rentals-service/models"

	"go.mongodb.org/mongo-driver/mongo"
)

func SeedRentals(collection *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	jsonData, err := ioutil.ReadFile("data/vehicles.json")
	if err != nil {
		log.Fatal("Cannot read file:", err)
	}

	var data map[string][]models.Rental
	json.Unmarshal(jsonData, &data)

	var rentals []interface{}
	for _, arr := range data {
		for _, item := range arr {
			rentals = append(rentals, item)
		}
	}

	result, err := collection.InsertMany(ctx, rentals)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted Records:", len(result.InsertedIDs))
}
