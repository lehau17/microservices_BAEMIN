package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

var db *sqlx.DB

func main() {
    // Load .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

    // Database connection
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbName := os.Getenv("DB_NAME")
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

    db, err = sqlx.Connect("mysql", dsn)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    log.Println("Connected to database!")

    // Initialize Gin
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
