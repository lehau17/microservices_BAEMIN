package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
	"encoding/json" // Import để sử dụng json.Marshal
)

func (s *sqlStorage) Create(ctx context.Context, comment *commentmodel.CommentCreate) (int64, error) {
	// Chuyển user thành chuỗi JSON
	userJson, err := json.Marshal(comment.User)
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	// Query SQL với chuỗi JSON cho trường user
	query := `
        INSERT INTO comments (post_id, user, content)
        VALUES (:post_id, :user, :content)
    `

	// Sử dụng NamedExec để thực thi query
	result, err := s.db.NamedExec(query, map[string]interface{}{
		"post_id": comment.PostID,
		"user":    userJson,
		"content": comment.Content,
	})
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return 0, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	return lastInsertID, nil
}
