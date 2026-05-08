package lomi

import "fmt"

type Error struct {
	StatusCode int
	Message    string
}

func (e *Error) Error() string {
	return fmt.Sprintf("lomi API error (status %d): %s", e.StatusCode, e.Message)
}
