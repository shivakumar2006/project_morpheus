package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Godown struct {
	ID           primitive.ObjectID `json:"_id" bson:"_id"`
	CustomID     int                `json:"id" bson:"id"`
	State        string             `json:"state" bson:"state"`
	District     string             `json:"district" bson:"district"`
	Location     string             `json:"location" bson:"location"`
	Address      string             `json:"address" bson:"address"`
	Warehouseman string             `json:"warehouseman" bson:"warehouseman"`
	Mobile       string             `json:"mobile" bson:"mobile"`
	CapacityMt   int                `json:"capacity_mt" bson:"capacity_mt"`
	WhCode       string             `json:"wh_code" bson:"wh_code"`
	Registration string             `json:"registration_date" bson:"registration_date"`
	ValidUpto    string             `json:"valid_upto" bson:"valid_upto"`
	CropsHandled []string           `json:"crops_handled" bson:"crops_handled"`
}
