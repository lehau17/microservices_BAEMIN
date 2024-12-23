package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
)

func (s *sqlStorage) Create(ctx context.Context, comment *commentmodel.CommentCreate) (int64, error) {
	query := `
        INSERT INTO comments (post_id, user, content)
        VALUES (:post_id, :user, :content)
    `
	result, err := s.db.NamedExec(query, comment)
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	return lastInsertID, nil
}
