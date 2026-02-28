package routes

import (
	"godowns/controllers"

	"github.com/gin-gonic/gin"
)

func GodownRoutes(r *gin.Engine) {
	g := r.Group("/godowns")

	g.GET("/", controllers.GetAllGodowns)
	g.GET("", controllers.GetAllGodowns)
	g.GET("/:state", controllers.GetGodownsByState)
}
