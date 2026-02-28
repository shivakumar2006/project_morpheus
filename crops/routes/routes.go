package routes

import (
	"crops/controllers"
	"net/http"
)

func CropRoutes(controller *controllers.CropController, mux *http.ServeMux) {
	mux.HandleFunc("/crops", controller.GetAllCrops)
	mux.HandleFunc("/crop", controller.GetCropById)
	mux.HandleFunc("/crops/category", controller.GetCropsByCategory)
	mux.HandleFunc("/crops/seed", controller.SeedCrops)

	mux.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("data"))))
}
