package models

type Rental struct {
	ID                int    `json:"_id" bson:"_id"`
	Name              string `json:"name" bson:"name"`
	Image             string `json:"image" bson:"image"`
	Category          string `json:"category" bson:"category"`
	RentalPricePerDay int    `json:"rentalPricePerDay" bson:"rentalPricePerDay"`
	Availability      bool   `json:"availability" bson:"availability"`
	Provider          string `json:"provider" bson:"provider"`
}
