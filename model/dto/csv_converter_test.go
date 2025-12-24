package dto

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"os"
	"sort"
	"strconv"
	"strings"
	"testing"
)

// parseAmount converts a string amount to float64
func parseAmount(amountStr string) float64 {
	// Remove commas and quotes
	cleaned := strings.ReplaceAll(amountStr, ",", "")
	cleaned = strings.ReplaceAll(cleaned, "\"", "")
	cleaned = strings.TrimSpace(cleaned)

	if cleaned == "" || cleaned == "0.00" {
		return 0
	}

	value, err := strconv.ParseFloat(cleaned, 64)
	if err != nil {
		return 0
	}
	return value
}

// extractCurrency extracts currency from account name
func extractCurrency(accountName string) Currency {
	accountUpper := strings.ToUpper(accountName)

	if strings.Contains(accountUpper, "RUB") {
		return RUB
	} else if strings.Contains(accountUpper, "USDT") {
		return USDT
	} else if strings.Contains(accountUpper, "EUR") {
		return EUR
	} else if strings.Contains(accountUpper, "USD") && !strings.Contains(accountUpper, "USDT") {
		return USD
	} else if strings.Contains(accountUpper, "ARS") {
		return ARS
	}

	// Default to RUB if no currency found
	return RUB
}

// isExchangeTransaction checks if this is a currency exchange
func isExchangeTransaction(description string) bool {
	descLower := strings.ToLower(description)
	return strings.Contains(descLower, "exchange") ||
		strings.Contains(descLower, "exchage") // typo in data
}

// isInternalTransaction checks if this is an internal transfer
func isInternalTransaction(description string) bool {
	descLower := strings.ToLower(description)
	return strings.Contains(descLower, "storno") ||
		strings.Contains(descLower, "refund")
}

func TestConvertCSVToJSON(t *testing.T) {
	// Open CSV file
	file, err := os.Open("cash - Accounting.csv")
	if err != nil {
		t.Fatalf("Error opening file: %v", err)
	}
	defer file.Close()

	// Create CSV reader
	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1 // Allow variable number of fields

	// Skip header row
	_, err = reader.Read()
	if err != nil {
		t.Fatalf("Error reading header: %v", err)
	}

	// Slice to maintain order of transactions
	transactions := []Transaction{}

	// Read CSV rows
	rowCount := 0
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			t.Logf("Error reading row: %v", err)
			continue
		}

		// Skip if not enough columns
		if len(record) < 8 {
			continue
		}

		// Extract data from columns A-H
		orderStr := strings.TrimSpace(record[0])
		date := strings.TrimSpace(record[1])
		description := strings.TrimSpace(record[2])
		category := strings.TrimSpace(record[3])
		accountName := strings.TrimSpace(record[4])
		creditStr := record[5]
		debitStr := record[6]
		balanceStr := record[7]

		// Parse order number
		order, err := strconv.Atoi(orderStr)
		if err != nil {
			// Skip rows without valid order number (like header rows)
			continue
		}

		// Skip empty rows or header-like rows
		if accountName == "" || accountName == "Account" {
			continue
		}

		// Use description as category if category is empty
		if category == "" {
			category = description
		}

		// Parse amounts
		creditAmount := parseAmount(creditStr)
		debitAmount := parseAmount(debitStr)
		balance := parseAmount(balanceStr)

		// Skip rows with no financial data
		if creditAmount == 0 && debitAmount == 0 {
			continue
		}

		// Determine currency from account name
		currency := extractCurrency(accountName)

		// Create movement
		movement := Movement{
			AccountName: accountName,
			AccountBalance: Amount{
				Value:    balance,
				Currency: currency,
			},
			Values: []Value{},
		}

		// Add credit value if exists
		if creditAmount > 0 {
			value := Value{
				Description: description,
				IsInternal:  isInternalTransaction(description),
				IsExchanged: isExchangeTransaction(description),
				Amount: Amount{
					Value:    creditAmount,
					Currency: currency,
				},
				Kind: MovementCredit,
			}
			movement.Values = append(movement.Values, value)
		}

		// Add debit value if exists
		if debitAmount > 0 {
			value := Value{
				Description: description,
				IsInternal:  isInternalTransaction(description),
				IsExchanged: isExchangeTransaction(description),
				Amount: Amount{
					Value:    debitAmount,
					Currency: currency,
				},
				Kind: MovementDebit,
			}
			movement.Values = append(movement.Values, value)
		}

		// Create a transaction for each row
		if len(movement.Values) > 0 {
			transaction := Transaction{
				Order:     order,
				Date:      date,
				Category:  category,
				Movements: []Movement{movement},
			}
			// Add color for certain categories
			if strings.Contains(strings.ToLower(category), "income") {
				transaction.Color = "green"
			} else if isExchangeTransaction(description) {
				transaction.Color = "blue"
			} else if isInternalTransaction(description) {
				transaction.Color = "gray"
			}
			transactions = append(transactions, transaction)
			rowCount++
		}
	}

	// Sort transactions by order descending (newest first)
	sort.Slice(transactions, func(i, j int) bool {
		return transactions[i].Order > transactions[j].Order
	})

	// Convert to JSON
	jsonData, err := json.MarshalIndent(transactions, "", "  ")
	if err != nil {
		t.Fatalf("Error converting to JSON: %v", err)
	}

	// Write to file
	outputFile := "transactions.json"
	err = os.WriteFile(outputFile, jsonData, 0644)
	if err != nil {
		t.Fatalf("Error writing file: %v", err)
	}

	t.Logf("Successfully converted CSV to JSON!")
	t.Logf("Output saved to: %s", outputFile)
	t.Logf("Total transactions: %d", len(transactions))
	t.Logf("Rows processed: %d", rowCount)

	// Validate the output
	if len(transactions) == 0 {
		t.Error("No transactions were generated")
	}
}