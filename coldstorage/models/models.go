package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type ColdStorage struct {
	ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name       string             `json:"name" bson:"name"`
	State      string             `json:"state" bson:"state"`
	City       string             `json:"city" bson:"city"`
	Address    string             `json:"address" bson:"address"`
	Phone      string             `json:"phone" bson:"phone"`
	Email      string             `json:"email" bson:"email"`
	Latitude   float64            `json:"latitude" bson:"latitude"`
	Longitude  float64            `json:"longitude" bson:"longitude"`
	CapacityMT int                `json:"capacity_mt" bson:"capacity_mt"`
	Type       string             `json:"type" bson:"type"`
}
