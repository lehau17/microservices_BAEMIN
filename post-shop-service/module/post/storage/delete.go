package poststorage

import (
	"context"
	"post-shop-service/common"
)

// DeletePost deletes a post by its ID.
func (s *sqlStore) DeletePost(ctx context.Context, postID int64) error {
	query := `
		DELETE FROM post
		WHERE id = :id
	`
	params := map[string]interface{}{
		"id": postID,
	}
	result, err := s.db.NamedExec(query, params)
	if err != nil {
		return common.NewErrorResponse(500, "Lỗi database khi xóa post")
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return common.NewErrorResponse(400, "Not found post")

	}

	return nil
}
