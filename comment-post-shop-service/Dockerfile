# Stage 1: Build
FROM golang:latest AS builder

WORKDIR /root/app

COPY . .

RUN go mod tidy

RUN go build -o main .

FROM scratch

COPY --from=builder /root/app/main /main
EXPOSE 8080

ENTRYPOINT ["/main"]
