package routes

import (
	"net/http"

	"coldstorage/controllers"

	"github.com/gorilla/mux"
)

func ColdStorageRoutes() *mux.Router {
	r := mux.NewRouter()

	// Only GET All
	r.HandleFunc("/cold-storages", controllers.GetColdStorages).Methods(http.MethodGet)

	return r
}
