package models

type Item struct {
	Title    string  `json:"title"`
	Price    float64 `json:"price"`
	Quantity int64   `json:"quantity"`
}

type RideData struct {
	VehicleName     string `json:"vehicleName"`
	VehicleCategory string `json:"vehicleCategory"`
	Pickup          string `json:"pickup"`
	Destination     string `json:"destination"`
	Days            int    `json:"days"`
	PartnerName     string `json:"partnerName"`
	TotalFare       int    `json:"totalFare"`
}

type CheckoutRequest struct {
	Mode     string   `json:"mode"`
	Items    []Item   `json:"items"`
	RideData RideData `json:"rideData"`
}
