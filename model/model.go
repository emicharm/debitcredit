package model

import (
	"time"
)

type TxID string

type Tx struct {
	UID  TxID
	PUID *TxID
	Date time.Time
}

type MovementKind string

const (
	CreditMovementType MovementKind = "credit"
	DebitMovementType  MovementKind = "debit"
)

type MovementDestination string

const (
	ExternalMovementExpose MovementDestination = "External"
	InternalMovementExpose MovementDestination = "Internal"
)

type Movement struct {
	Account string
	Amount  Amount
	Type    MovementKind
	Expose  MovementDestination
}

type Balance struct {
	Account string
	Balance Amount
}
