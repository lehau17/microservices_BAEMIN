package common

// RpcResponse defines the standard response for RPC communication
type RpcErrorResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
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
