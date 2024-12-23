package commentstorage

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
	"encoding/json"
	"errors"
	"time"
)

func (s *sqlStorage) UpdateComment(ctx context.Context, data *commentmodel.CommentUpdate) (*commentmodel.Comment, error) {
	// Kiểm tra sự tồn tại của bình luận với ID đã cho
	var existingComment commentmodel.Comment
	queryCheck := `SELECT id, post_id, user, content FROM comments WHERE id = :id`
	err := s.db.GetContext(ctx, &existingComment, queryCheck, data.ID)
	if err != nil {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	var userIDFromJSON map[string]interface{}
	err = json.Unmarshal([]byte(existingComment.User), &userIDFromJSON)
	if err != nil {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, errors.New("error unmarshalling user JSON"))
	}

	// Nếu user_id không khớp, trả về lỗi
	if userIDFromJSON["id"] != data.UserID {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusForbidden, errors.New("you do not have permission to update this comment"))
	}

	// Nếu hợp lệ, tiến hành cập nhật nội dung bình luận
	queryUpdate := `UPDATE comments SET content = :content, updated_at = CURRENT_TIMESTAMP WHERE id = :id`
	_, err = s.db.NamedExecContext(ctx, queryUpdate, data)
	if err != nil {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}

	// Trả về bình luận đã cập nhật
	updatedComment := existingComment
	updatedComment.Content = data.Content
	updatedComment.UpdatedAt = time.Now().Format("2006-01-02 15:04:05") // Thời gian cập nhật lấy thời gian hiện tại
	return &updatedComment, nil
}
