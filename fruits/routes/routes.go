package routes

import (
	"fruits/controllers"
	"net/http"
)

func FruitRoutes(controller *controllers.FruitController, mux *http.ServeMux) {
	mux.HandleFunc("/fruits/category", controller.GetFruitsByCategory)
	mux.HandleFunc("/fruits/seed", controller.SeedFruit)
	mux.HandleFunc("/fruit", controller.GetFruitById)
	mux.HandleFunc("/fruits", controller.GetFruits)

	mux.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("data"))))

}
