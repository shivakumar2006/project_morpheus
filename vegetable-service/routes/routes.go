package routes

import (
	"net/http"
	"vegetable-service/controllers"
)

func VegetableRoutes(controller *controllers.VegetableController, mux *http.ServeMux) {
	mux.HandleFunc("/vegetables", controller.GetAllVegetables)
	mux.HandleFunc("/vegetable", controller.GetVegetableById)
	mux.HandleFunc("/vegetables/category", controller.GetVegetablesByCategory)
	mux.HandleFunc("/vegetables/seed", controller.SeedVegetables)

	mux.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("data"))))
}
