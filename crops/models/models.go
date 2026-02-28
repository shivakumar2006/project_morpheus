package models

type Crop struct {
	ID               int    `json:"_id" bson:"_id"`
	Name             string `json:"name" bson:"name"`
	Image            string `json:"image" bson:"image"`
	Category         string `json:"category" bson:"category"`
	SoilType         string `json:"soilType" bson:"soilType"`
	Season           string `json:"season" bson:"season"`
	WaterRequirement string `json:"waterRequirement" bson:"waterRequirement"`
	Price            int    `json:"price" bson:"price"`
}
