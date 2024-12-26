# Stage 1: Build
FROM golang:latest AS builder

WORKDIR /root/app



COPY . .

RUN go mod download
RUN go build -o main .

FROM scratch

COPY --from=builder /root/app/main /main

# # Copy chứng chỉ SSL (nếu ứng dụng sử dụng HTTPS)
# COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["/main"]
