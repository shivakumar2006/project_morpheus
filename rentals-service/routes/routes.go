package routes

import (
	"rentals-service/controllers"

	"net/http"

	"github.com/gorilla/mux"
)

func RentalRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/rentals", controllers.GetAllRentals).Methods(http.MethodGet)
	r.HandleFunc("/rentals/category", controllers.GetRentalsByCategory).Methods(http.MethodGet)
	r.HandleFunc("/rentals/{id}", controllers.GetRentalByID).Methods(http.MethodGet)

	fileServer := http.FileServer(http.Dir("data"))
	r.PathPrefix("/images/").
		Handler(http.StripPrefix("/images/", fileServer)).
		Methods(http.MethodGet)

	return r
}
