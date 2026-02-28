package models

type Product struct {
	ID       string `json:"id" bson:"id"`
	ProdID   string `json:"prod_id" bson:"prod_id"`
	Name     string `json:"name" bson:"name"`
	Brand    string `json:"brand" bson:"brand"`
	Price    int    `json:"price" bson:"price"`
	ImageURL string `json:"imageUrl" bson:"imageUrl"`
	Category string `json:"category" bson:"category"`
}
