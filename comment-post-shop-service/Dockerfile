# Stage 1: Build
FROM golang:1.20-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -o main .

FROM scratch

COPY --from=builder /app/main /main

# # Copy chứng chỉ SSL (nếu ứng dụng sử dụng HTTPS)
# COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["/main"]
