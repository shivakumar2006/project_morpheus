package controllers

import (
	"context"
	"net/http"

	"godowns/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var GodownCollection *mongo.Collection

func InitGodownController(db *mongo.Database) {
	GodownCollection = db.Collection("godown")
}

func GetAllGodowns(c *gin.Context) {
	cursor, err := GodownCollection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot fetch godowns"})
		return
	}

	var data []models.Godown
	if err := cursor.All(context.Background(), &data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode error"})
		return
	}

	c.JSON(http.StatusOK, data)
}

func GetGodownsByState(c *gin.Context) {
	state := c.Param("state")

	cursor, err := GodownCollection.Find(context.Background(), bson.M{"state": state})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot fetch godowns"})
		return
	}

	var data []models.Godown
	if err := cursor.All(context.Background(), &data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode error"})
		return
	}

	c.JSON(http.StatusOK, data)
}
