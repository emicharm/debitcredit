package dto

import "fmt"

type MovementKind string

func (k MovementKind) Validate() error {
	if k != MovementDebit && k != MovementCredit {
		return fmt.Errorf("kind should be one of: %s %s", MovementDebit, MovementCredit)
	}
	return nil
}

const (
	MovementDebit  MovementKind = "debit"
	MovementCredit MovementKind = "credit"
)

type Currency string

func (c Curre)

const (
	RUB  Currency = "RUB"
	USD  Currency = "USD"
	USDT Currency = "USDT"
	EUR  Currency = "EUR"
	ARS  Currency = "ARS"
)

type Amount struct {
	Value    float64  `json:"value" binding:"required,gt=0"`
	Currency Currency `json:"currency" binding:"required,oneof=RUB USD USDT EUR ARS"`
}

func (a Amount) Validate() error {
	if a.Value <= 0 {
		return fmt.Errorf("amount should be positive number")
	}
}

func (a Amount) IsNil() bool {
	return a.Value == 0.0 && a.Currency == ""
}

func (a Amount) IsZero() bool {
	return a.Value == 0.0 && a.Currency != ""
}

type Account struct {
	Name     string   `json:"name" binding:"required,min=3"`
	Currency Currency `json:"currency" binding:"required,oneof=RUB USD USDT EUR ARS"`
}

func (a Account) String() string {
	return fmt.Sprintf("%s %s", a.Name, a.Currency)
}

type Value struct {
	Description string       `json:"description"`
	IsInternal  bool         `json:"is_internal"`
	IsExchanged bool         `json:"is_exchanged"`
	Amount      Amount       `json:"amount" binding:"required"`
	Kind        MovementKind `json:"kind" binding:"required,oneof=debit credit"`
}

type Movement struct {
	Account Account `json:"account" binding:"required,min=1"`
	Balance Amount  `json:"balance" binding:"required"`
	Values  []Value `json:"values" binding:"required,min=1"`
}

type Transaction struct {
	ID        string     `json:"id" binding:"required"`
	Date      string     `json:"date" binding:"required"`
	Category  string     `json:"category" binding:"required"`
	Movements []Movement `json:"movements" binding:"required,min=1"`
}

func (t Transaction) Validate() error {
}
