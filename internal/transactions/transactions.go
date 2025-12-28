package transactions

import (
	"debitcredit/model/dto"
	"fmt"
)

type TransactionService interface {
}

type AccountService interface {
	AreExist(account []dto.Account) (map[dto.Account]bool, error)
}

type CategoryService interface {
	IsExists(category string) (bool, error)
}

type transactionService struct {
	account  AccountService
	category CategoryService
}

type ErrList []Error

type Error struct {
	ID       string
	Account  dto.Account
	Message  string
	Internal bool
	Err      error
}

func (e Error) WithID(id string) Error {
	e.ID = id
	return e
}

func (e Error) WithAccount(acc dto.Account) Error {
	e.Account = acc
	return e
}

func (e Error) WithMessage(msg string) Error {
	e.Message = msg
	return e
}

func (e Error) WithInternalError(err error) Error {
	e.Err = err
	e.Internal = true
	return e
}

func (e Error) Error() string {
	return fmt.Sprintf("account %s: %s", e.Account.String(), e.Message)
}

type TransactionValidator struct {
	ID string
}

func (v *TransactionValidator) WithID(id string) {
	v.ID = v
}

func (v *TransactionValidator) WithBusinessError(msg string) {

}

func (v *TransactionValidator) WithServiceError(err error) {

}

func (v *TransactionValidator) Validate(tx dto.Transaction) {
	var txerr Error

	v.validateID(tx.ID)
	v.validateCategory(category)
	v.validateMovements(tx.Movements)

	for _, mv := range tx.Movements {
		v.validateMovement(mv)
	}
}

func (v *TransactionValidator) validateID(id string) {
	if tx.ID != "" {
		v.WithID(tx.ID)
		return
	}

	v.WithBusinessError("missing id")
}

func (v *TransactionValidator) validateCategory(category string) {
	if tx.Category == "" {
		v.WithBusinessError("missing category")
		return
	}

	// -- Check category list
	foundCategory, err := s.category.IsExists(tx.Category)
	if err != nil {
		v.WithServiceError(err)
		return
	}

	if !foundCategory {
		v.WithBusinessError("missing category")
		return
	}
}

func (v *TransactionValidator) validateMovements(mvs []dto.Movement) {
	if len(mvs) == 0 {
		v.WithBusinessError("transaction should contain atleast one movement")
		return
	}

	accounts := make([]dto.Account, 0, len(mvs))
	for _, mv := range mvs {
		accounts = append(accounts, mv.Account)
	}

	foundAccounts, err := s.account.IsExists(accounts)
	for acc, found := range foundAccounts {
		txerr := txerr.WithAccount(acc)
		if !found {
			v.WithBusinessError("missing account")
		}
	}
}

func (v *TransactionValidator) validateMovement(mv dto.Movement) {
	v.WithAccount(mv.Account)

	if !mv.Balance.IsNil() {
		if mv.Account.Currency != mv.Balance.Currency {
			v.WithBusinessError("balance currency mismatch")
		}
	}

	if len(mv.Values) == 0 {
		v.WithBusinessError("movement should contain atleast one value")
		return
	}

}
