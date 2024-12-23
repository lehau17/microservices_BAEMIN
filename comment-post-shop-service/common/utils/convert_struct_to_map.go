package utils

import (
	"fmt"
	"reflect"
)

func structToMap(v interface{}) (map[string]interface{}, error) {
	// Khởi tạo map kết quả
	result := make(map[string]interface{})

	// Dùng reflect để lấy thông tin về struct
	val := reflect.ValueOf(v)
	if val.Kind() == reflect.Ptr {
		val = val.Elem() // Lấy giá trị của struct nếu là con trỏ
	}

	// Kiểm tra nếu không phải là struct thì trả lỗi
	if val.Kind() != reflect.Struct {
		return nil, fmt.Errorf("input is not a struct")
	}

	// Duyệt qua tất cả các field của struct
	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldName := val.Type().Field(i).Name

		// Lấy giá trị của từng field và thêm vào map
		result[fieldName] = field.Interface()
	}

	return result, nil
}

func CovertStructToMap(v interface{}) (map[string]interface{}, error) {
	return structToMap(v)
}
