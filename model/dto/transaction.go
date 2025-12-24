package dto

type MovementKind string

const (
	MovementDebit  MovementKind = "debit"
	MovementCredit MovementKind = "credit"
)

type Currency string

const (
	RUB  Currency = "RUB"
	USD  Currency = "USD"
	USDT Currency = "USDT"
	EUR  Currency = "EUR"
	ARS  Currency = "ARS"
)

type Amount struct {
	Value    float64  `json:"value"`
	Currency Currency `json:"currency"`
}

type Value struct {
	Description string       `json:"description"`
	IsInternal  bool         `json:"is_internal"`
	IsExchanged bool         `json:"is_exchanged"`
	Amount      Amount       `json:"amount"`
	Kind        MovementKind `json:"kind"`
}

type Movement struct {
	AccountName    string  `json:"account_name"`
	AccountBalance Amount  `json:"account_balance"`
	Values         []Value `json:"values"`
}

type Transaction struct {
	Order     int        `json:"order"`
	Date      string     `json:"date"`
	Category  string     `json:"category"`
	Color     string     `json:"color,omitempty"`
	Movements []Movement `json:"movements"`
}
