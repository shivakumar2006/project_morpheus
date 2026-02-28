package routes

import (
	"net/http"

	"cart/controllers" // change module path

	"github.com/gorilla/mux"
)

// RegisterCartRoutes attaches routes to given router
func RegisterCartRoutes(r *mux.Router, cc *controllers.CartController) {
	r.HandleFunc("/cart/add", cc.AddToCart).Methods(http.MethodPost)
	r.HandleFunc("/cart", cc.GetCart).Methods(http.MethodGet)
	// update quantity via query: /cart/update?action=inc&itemId=xxx  (you can call from frontend)
	r.HandleFunc("/cart/update", cc.UpdateQuantity).Methods(http.MethodPatch)
	r.HandleFunc("/cart/remove", cc.RemoveFromCart).Methods(http.MethodDelete)
	r.HandleFunc("/cart/clear", cc.ClearCart).Methods(http.MethodDelete)
}
