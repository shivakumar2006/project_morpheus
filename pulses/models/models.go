package models

type Pulse struct {
	ID               int    `json:"_id" bson:"_id"`
	Name             string `json:"name" bson:"name"`
	Image            string `json:"image" bson:"image"`
	Season           string `json:"season" bson:"season"`
	SoilType         string `json:"soilType" bson:"soilType"`
	WaterRequirement string `json:"waterRequirement" bson:"waterRequirement"`
	Price            int    `json:"price" bson:"price"`
}
