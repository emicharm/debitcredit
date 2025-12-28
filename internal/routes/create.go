package routes

import (
	"debitcredit/model/dto"
	"fmt"

	"github.com/gin-gonic/gin"
)

func (*Routes) CreateTransaction(c *gin.Context) {
	var transaction dto.Transaction
	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
	}

	fmt.Println(transaction)

}
