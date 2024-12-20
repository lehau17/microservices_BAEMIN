package config

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
)

func NewSqlInstance() *sqlx.DB {
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbName := os.Getenv("DB_NAME")
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

    db, err := sqlx.Connect("mysql", dsn)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    log.Println("Connected to database!")
	return db
}
