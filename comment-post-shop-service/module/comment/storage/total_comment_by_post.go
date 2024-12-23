package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	"context"
)

func (s *sqlStorage) CountCommentByPost(ctx context.Context, post_id int64) (int64, error) {
	var count int64

	// Truy vấn để đếm số lượng bình luận theo post_id
	query := `SELECT COUNT(id) FROM comments WHERE post_id = ?`

	// Thực thi truy vấn
	err := s.db.GetContext(ctx, &count, query, post_id)
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	return count, nil
}
