package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	"context"
	"errors"
)

func (s *sqlStorage) Delete(ctx context.Context, commentID int64) (int64, error) {
	// Truy vấn SQL để xóa bình luận theo ID
	query := `
        DELETE FROM comments 
        WHERE id = :id
    `
	// Thực thi câu lệnh SQL với tham số là commentID
	result, err := s.db.NamedExec(query, map[string]interface{}{"id": commentID})
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}
	rowAffect, _ := result.RowsAffected()
	if rowAffect == 0 {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusBadRequest, errors.New("not found comment"))
	}
	return rowAffect, nil
}
