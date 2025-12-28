package main

import (
	"debitcredit/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	routes := routes.Routes{}
	r.POST("/api/v1/transactions", routes.CreateTransaction)
	r.Run() // listen and serve on 0.0.0.0:8080
}
