package httpstatus

const (
	// Informational responses
	StatusContinue           = 100
	StatusSwitchingProtocols = 101
	StatusProcessing         = 102

	// Successful responses
	StatusOK                   = 200
	StatusCreated              = 201
	StatusAccepted             = 202
	StatusNonAuthoritativeInfo = 203
	StatusNoContent            = 204
	StatusResetContent         = 205
	StatusPartialContent       = 206

	// Redirection messages
	StatusMultipleChoices   = 300
	StatusMovedPermanently  = 301
	StatusFound             = 302
	StatusSeeOther          = 303
	StatusNotModified       = 304
	StatusTemporaryRedirect = 307
	StatusPermanentRedirect = 308

	// Client error responses
	StatusBadRequest           = 400
	StatusUnauthorized         = 401
	StatusPaymentRequired      = 402
	StatusForbidden            = 403
	StatusNotFound             = 404
	StatusMethodNotAllowed     = 405
	StatusNotAcceptable        = 406
	StatusProxyAuthRequired    = 407
	StatusRequestTimeout       = 408
	StatusConflict             = 409
	StatusGone                 = 410
	StatusLengthRequired       = 411
	StatusPreconditionFailed   = 412
	StatusPayloadTooLarge      = 413
	StatusURITooLong           = 414
	StatusUnsupportedMediaType = 415
	StatusRangeNotSatisfiable  = 416
	StatusExpectationFailed    = 417
	StatusTeapot               = 418 // Easter egg (RFC 2324)
	StatusUnprocessableEntity  = 422
	StatusTooManyRequests      = 429

	// Server error responses
	StatusInternalServerError           = 500
	StatusNotImplemented                = 501
	StatusBadGateway                    = 502
	StatusServiceUnavailable            = 503
	StatusGatewayTimeout                = 504
	StatusHTTPVersionNotSupported       = 505
	StatusVariantAlsoNegotiates         = 506
	StatusInsufficientStorage           = 507
	StatusLoopDetected                  = 508
	StatusNotExtended                   = 510
	StatusNetworkAuthenticationRequired = 511
)
