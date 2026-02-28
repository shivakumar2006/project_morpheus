package routes

import (
	"farmer-esentials/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func ProductRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/products", controllers.GetAllProducts).Methods(http.MethodGet)

	r.HandleFunc("/products/category", controllers.GetProductsByCategory).Methods(http.MethodGet)
	r.HandleFunc("/products/{id}", controllers.GetProductByID).Methods(http.MethodGet)

	return r
}
