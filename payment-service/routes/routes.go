package routes

import (
	"net/http"
	"payment-service/controllers"

	"github.com/gorilla/mux"
)

func PaymentRoutes(r *mux.Router, pc *controllers.PaymentController) {

	r.HandleFunc("/create-checkout-session", pc.CreateCheckoutSession).Methods(http.MethodPost)
	r.HandleFunc("/verify-session", pc.VerifySession).Methods(http.MethodGet)
}
