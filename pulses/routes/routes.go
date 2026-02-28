package routes

import (
	"net/http"
	"pulses/controllers"
)

func PulseRoutes(controller *controllers.PulseController, mux *http.ServeMux) {
	mux.HandleFunc("/pulses/seed", controller.SeedPulses)
	mux.HandleFunc("/pulses", controller.GetPulses)
	mux.HandleFunc("/pulse", controller.GetPulseById)

	mux.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("data"))))
}
