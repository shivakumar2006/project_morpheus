package routes

import (
	"net/http"

	"auth/controllers"

	"github.com/gorilla/mux"
)

func Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/signup", controllers.Signup).Methods(http.MethodPost)
	r.HandleFunc("/login", controllers.Login).Methods(http.MethodPost)
	r.HandleFunc("/verify", controllers.VerifyToken).Methods(http.MethodGet)
	return r
}
