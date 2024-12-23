package handlermessagebroken

import (
	"comment-post-shop-service/common"
	"comment-post-shop-service/common/paging"
	appcontext "comment-post-shop-service/component/app_context"
	commentmodel "comment-post-shop-service/module/comment/model"
	messagebrokenrabbitmq "comment-post-shop-service/module/comment/tranport/message_broken_rabbitMQ"
	"fmt"
	"log"
	"strconv"

	"github.com/streadway/amqp"
)

func HandlerMessageBroken(payloadQueue *common.PayloadQueue, d *amqp.Delivery, appCtx appcontext.AppContext) {
	switch payloadQueue.Pattern {
	case "create_comment":
		if postData, ok := payloadQueue.Data.(map[string]interface{}); ok {
			var createPost commentmodel.CommentCreate
			if content, ok := postData["content"].(string); ok {
				createPost.Content = content
			}
			if post_id, ok := postData["post_id"].(float64); ok { // float64 vì RabbitMQ có thể gửi số như vậy
				createPost.PostID = int64(post_id)
			}
			var user commentmodel.User

			if user_id, ok := postData["user_id"].(float64); ok {
				user.ID = int64(user_id)
			}
			if username, ok := postData["username"].(string); ok {
				user.Username = username
			}
			if email, ok := postData["email"].(string); ok {
				user.Email = email
			}
			createPost.User = user
			messagebrokenrabbitmq.CreatePost(appCtx, &createPost, d)
		} else {
			log.Printf("Data in payloadQueue is not of type map[string]interface{}")
		}
	case "delete_comment":
		if id, ok := payloadQueue.Data.(float64); ok { // RabbitMQ có thể gửi số dưới dạng float64
			messagebrokenrabbitmq.DeleteComment(appCtx, int64(id), d)
		} else {
			log.Printf("Data in payloadQueue is not of type int64")
		}
	case "update_comment":
		if payloadUpdateComment, ok := payloadQueue.Data.(map[string]interface{}); ok {
			var comment commentmodel.CommentUpdate
			if id, ok := payloadUpdateComment["id"].(float64); ok {
				comment.ID = int64(id)
			}
			if userId, ok := payloadUpdateComment["user_id"].(float64); ok {
				comment.UserID = int64(userId)
			}
			if content, ok := payloadUpdateComment["content"].(string); ok {
				comment.Content = content
			}
			messagebrokenrabbitmq.UpdateComment(appCtx, &comment, d)
		}

	case "delete_post":
		// if id, ok := payloadQueue.Data.(float64); ok {
		// 	posttranport.DeletePost(appCtx, int64(id), d)
		// } else {
		// 	log.Printf("Data in payloadQueue is not of type int64")
		// }
	case "find_all_by_post":
		if pagingData, ok := payloadQueue.Data.(map[string]interface{}); ok {
			var p paging.Paging
			var post_id int64

			if page, ok := pagingData["page"].(string); ok {
				page, _ := strconv.Atoi(page)
				p.Page = page
			}

			if limit, ok := pagingData["limit"].(string); ok {
				limit, _ := strconv.Atoi(limit)
				p.Limit = limit
			}

			if cursor, ok := pagingData["cursor"].(string); ok {
				cursor, err := strconv.Atoi(cursor)
				if err != nil {
					log.Printf("Failed to convert cursor to int: %v", err)
				} else {
					p.Cursor = &cursor
				}
			}
			if post_id_payload, ok := pagingData["post_id"].(float64); ok {
				post_id = int64(post_id_payload)
			}
			p.Validate()
			messagebrokenrabbitmq.FindAllByPost(appCtx, &p, post_id, d)
		} else {
			log.Printf("Data in payloadQueue is not of type map[string]interface{}")
		}
	case "count_comment_by_post":
		if id, ok := payloadQueue.Data.(float64); ok {
			messagebrokenrabbitmq.TotalCountCommentByPost(appCtx, int64(id), d)
		} else {
			log.Printf("Data in payloadQueue is not of type int64")
		}
	case "decrease_one_like":
		// if id, ok := payloadQueue.Data.(float64); ok {
		// 	posttranport.DescreaseLike(appCtx, int(id), d)
		// } else {
		// 	log.Printf("Data in payloadQueue is not of type int64")
		// }
	default:
		fmt.Printf("Unknown pattern: %s\n", payloadQueue.Pattern)
	}

}
