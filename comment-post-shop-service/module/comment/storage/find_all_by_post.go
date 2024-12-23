package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	"comment-post-shop-service/common/paging"
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
)

func (s *sqlStorage) FindAllByPost(ctx context.Context, paging *paging.Paging, post_id int64) ([]commentmodel.Comment, error) {
	// Validate and set default values for paging
	paging.Validate()

	var query string
	args := make(map[string]interface{})

	// Base query to find comments by post_id
	query = `SELECT id, post_id, user, content, created_at, updated_at FROM comments WHERE post_id = :post_id`
	args["post_id"] = post_id

	// Add cursor logic (if cursor exists, use it to filter records)
	if paging.Cursor != nil {
		query += ` AND id > :cursor`
		args["cursor"] = *paging.Cursor
	} else {
		// If no cursor, we use OFFSET and LIMIT
		query += ` OFFSET :offset`
		args["offset"] = (paging.Page - 1) * paging.Limit
	}
	query += " LIMIT :limit"
	args["limit"] = paging.Limit

	// Execute the query
	var comments []commentmodel.Comment
	err := s.db.SelectContext(ctx, &comments, query, args)
	if err != nil {

		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	return comments, nil
}
