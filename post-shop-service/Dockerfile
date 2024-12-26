# Stage 1: Build
FROM golang:latest AS builder

WORKDIR /root/app

# Copy toàn bộ mã nguồn
COPY . .

# Tải module và đồng bộ file go.sum
RUN go mod tidy

# Xây dựng ứng dụng
RUN go build -o main .

# Stage 2: Runtime
FROM scratch

# Copy file thực thi từ giai đoạn build
COPY --from=builder /root/app/main /main

# Mở cổng
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["/main"]
