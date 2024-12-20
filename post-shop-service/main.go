package main

import (
	"post-shop-service/config"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

func main() {
	config.NewLoadConfigENV()
	config.NewSqlInstance()
	gin.SetMode(gin.DebugMode)
    r := gin.Default()

	

    // Routes
    r.GET("/users", getUsers)

    // Start server
    r.Run(":8080")
}

type User struct {
    ID   int    `db:"id" json:"id"`
    Name string `db:"name" json:"name"`
}

func getUsers(c *gin.Context) {
    var users []User
    err := db.Select(&users, "SELECT id, name FROM users")
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, users)
}
