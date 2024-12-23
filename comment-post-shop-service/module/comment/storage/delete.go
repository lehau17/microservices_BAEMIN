package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
)

func (s *sqlStorage) Delete(commentID int64) error {
	// Truy vấn SQL để xóa bình luận theo ID
	query := `
        DELETE FROM comments 
        WHERE id = :id
    `
	// Thực thi câu lệnh SQL với tham số là commentID
	_, err := s.db.NamedExec(query, map[string]interface{}{"id": commentID})
	if err != nil {
		return common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	return nil
}
