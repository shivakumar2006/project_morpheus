package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// CartItem represents a single cart document (one doc per user-item)
type CartItem struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID   string             `bson:"userId" json:"userId"`
	ItemID   string             `bson:"itemId" json:"itemId"`   // ID from source service (stored as string)
	Service  string             `bson:"service" json:"service"` // vegetable | pulse | fruit | crop | essential
	Name     string             `bson:"name" json:"name"`
	Price    float64            `bson:"price" json:"price"`
	Image    string             `bson:"image" json:"image"`
	Category string             `bson:"category" json:"category"`
	Quantity int                `bson:"quantity" json:"quantity"`
}
