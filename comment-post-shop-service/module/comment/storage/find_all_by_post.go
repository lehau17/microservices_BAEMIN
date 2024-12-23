package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	"comment-post-shop-service/common/paging"
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
)

func (s *sqlStorage) FindAllByPost(ctx context.Context, paging *paging.Paging, post_id int64) ([]commentmodel.Comment, error) {
	// Validate và thiết lập giá trị mặc định cho paging
	paging.Validate()

	args := map[string]interface{}{
		"post_id": post_id,
		"limit":   paging.Limit,
	}

	// Câu truy vấn cơ bản để tìm comment theo post_id
	query := `SELECT id, post_id, user, content, created_at, updated_at 
              FROM comments WHERE post_id = :post_id`

	// Thêm logic xử lý cursor (nếu có)
	if paging.Cursor != nil {
		query += ` AND id > :cursor`
		args["cursor"] = *paging.Cursor
	}
	query += " LIMIT :limit"

	// Nếu không có cursor, thêm OFFSET
	if paging.Cursor == nil {
		query += " OFFSET :offset"
		args["offset"] = (paging.Page - 1) * paging.Limit
	}

	// Thực thi câu truy vấn
	var comments []commentmodel.Comment
	query, namedArgs, err := s.db.BindNamed(query, args)
	if err != nil {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	err = s.db.SelectContext(ctx, &comments, query, namedArgs...)
	if err != nil {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	return comments, nil
}
