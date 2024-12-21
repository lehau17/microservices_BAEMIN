package common

import "fmt"

// RpcResponse defines the standard response for RPC communication
type RpcErrorResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

func (e RpcErrorResponse) Error() string {
	return e.Message
}

func NewErrorResponse(code int, message string) RpcErrorResponse {
	return RpcErrorResponse{
		StatusCode: (code),
		Message:    message,
	}
}

func NewSqlErrorResponse(err error) RpcErrorResponse {
	return RpcErrorResponse{
		StatusCode: 500,
		Message:    err.Error(),
	}
}

func NewErrorRpcResponse(statusCode int, err error) RpcErrorResponse {
	return RpcErrorResponse{
		StatusCode: statusCode,
		Message:    err.Error(),
	}
}

func ErrEntityNotFound(entityName string, id interface{}) error {
	return fmt.Errorf("entity %s with ID %v not found", entityName, id)
}

// Tạo một lỗi CannotGetEntity
func ErrCannotGetEntity(entityName string, err error) error {
	return fmt.Errorf("cannot get entity %s: %v", entityName, err)
}
