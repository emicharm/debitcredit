package model

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestHello(t *testing.T) {

	cases := []struct {
		input    string
		err      bool
		expected string
	}{
		{
			input:    "1245.32 ARS",
			err:      false,
			expected: "1245.32 ARS",
		},
		{
			input:    "0 USDT",
			err:      false,
			expected: "0.00 USDT",
		},
		{
			input: "wino we",
			err:   true,
		},
	}

	for _, c := range cases {
		amount, err := ParseAmount(c.input)
		if c.err {
			require.Error(t, err)
		} else {
			require.Equal(t, c.expected, amount.String())
		}
	}
}
