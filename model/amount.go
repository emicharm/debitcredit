package model

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/shopspring/decimal"
)

var r = regexp.MustCompile(`[,]`)

type Amount struct {
	amount   decimal.Decimal
	currency string
}

func (s Amount) String() string {
	return fmt.Sprint(s.amount.StringFixed(2), " ", s.currency)
}

func (s *Amount) UnmarshalJSON(b []byte) error {
	amount, err := ParseAmount(string(b))
	if err != nil {
		return err
	}

	*s = amount
	return nil
}

func ParseAmount(s string) (Amount, error) {
	s = strings.TrimPrefix(s, "\"")
	s = strings.TrimSuffix(s, "\"")

	fields := strings.Fields(s)
	if len(fields) != 2 {
		return Amount{}, fmt.Errorf("failed to parse amount: should look like 1234.56 USD")
	}

	amount, err := decimal.NewFromFormattedString(fields[0], r)
	if err != nil {
		return Amount{}, fmt.Errorf("failed to parse amount: %w", err)
	}

	return Amount{
		amount:   amount,
		currency: fields[1],
	}, nil
}
