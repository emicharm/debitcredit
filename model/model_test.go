package model

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type Movement1 struct {
	Account     string              `json:"account"`
	Amount      Amount              `json:"amount"`
	Kind        MovementKind        `json:"kind"`
	Destination MovementDestination `json:"destination"`
	Description string              `json:"description"`
	Balance     Amount              `json:"balance"`
}

type Transaction struct {
	ID    string `json:"id"`
	After string `json:"after"`
	Date  string `json:"date"`

	Description string `json:"description"`
	Category    string `json:"category"`

	Movements []Movement1 `json:"movements"`
}

var txs = map[TxID]Tx{}
var movements = map[TxID][]Movement{}
var balances = map[TxID][]Balance{}

func Date(s string) time.Time {
	t, err := time.Parse("2005-01-02", s)
	if err != nil {
		panic(err)
	}
	return t
}

func TestEvents(t *testing.T) {
	b, err := os.ReadFile("./example_ibt.jsonl")
	require.NoError(t, err)

	dec := json.NewDecoder(bytes.NewBuffer(b))

	for dec.More() {
		var tx Transaction
		err = dec.Decode(&tx)
		require.NoError(t, err)
		fmt.Println(tx)
	}
	t.Fail()
}
