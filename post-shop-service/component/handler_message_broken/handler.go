package handlermessagebroken

import (
	"fmt"
	"log"
	"post-shop-service/common"
	"post-shop-service/common/paging"
	appcontext "post-shop-service/component/app_context"
	posttranport "post-shop-service/module/post/tranport"
	"strconv"

	"github.com/streadway/amqp"
)

func HandlerMessageBroken(payloadQueue *common.PayloadQueue, d *amqp.Delivery, appCtx appcontext.AppContext) {
	switch payloadQueue.Pattern {
	case "create_post_event":
		if postData, ok := payloadQueue.Data.(map[string]interface{}); ok {
			var createPost common.CreatePost
			if title, ok := postData["title"].(string); ok {
				createPost.Title = title
			}
			if content, ok := postData["content"].(string); ok {
				createPost.Content = content
			}
			if shopID, ok := postData["shop_id"].(float64); ok { // float64 vì RabbitMQ có thể gửi số như vậy
				createPost.ShopID = int(shopID)
			}
			if hashtag, ok := postData["hashtag"].(string); ok {
				createPost.Hashtag = hashtag
			}
			if status, ok := postData["status"].(string); ok {
				createPost.Status = status
			}
			posttranport.CreatePost(appCtx, &createPost, d)
		} else {
			log.Printf("Data in payloadQueue is not of type map[string]interface{}")
		}
	case "find_one_post_event":
		if id, ok := payloadQueue.Data.(float64); ok { // RabbitMQ có thể gửi số dưới dạng float64
			posttranport.FindPost(appCtx, int64(id), d)
		} else {
			log.Printf("Data in payloadQueue is not of type int64")
		}
	case "find_all_paging":
		if pagingData, ok := payloadQueue.Data.(map[string]interface{}); ok {

			var p paging.Paging
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
			p.Validate()
			posttranport.FindAllPost(appCtx, &p, d)
		} else {
			log.Printf("Data in payloadQueue is not of type map[string]interface{}")
		}
	case "delete_post":
		if id, ok := payloadQueue.Data.(float64); ok {
			posttranport.DeletePost(appCtx, int64(id), d)
		} else {
			log.Printf("Data in payloadQueue is not of type int64")
		}
	case "find_all_by_shop":
		if pagingData, ok := payloadQueue.Data.(map[string]interface{}); ok {
			fmt.Printf("pagingData: %v\n %t", pagingData, pagingData["shop_id"])
			var p paging.Paging
			var shop_id int
			if page, ok := pagingData["page"].(string); ok {
				page, _ := strconv.Atoi(page)
				p.Page = page
			}
			if shop_id_payload, ok := pagingData["shop_id"].(float64); ok {
				shop_id_int := int(shop_id_payload)
				shop_id = (shop_id_int)
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
			p.Validate()
			posttranport.FindAllByShop(appCtx, &p, d, int(shop_id))
		} else {
			log.Printf("Data in payloadQueue is not of type map[string]interface{}")
		}
	case "increase_one_like":
		if id, ok := payloadQueue.Data.(float64); ok {
			posttranport.IncreaseLike(appCtx, int(id), d)
		} else {
			log.Printf("Data in payloadQueue is not of type int64")
		}
	case "decrease_one_like":
		if id, ok := payloadQueue.Data.(float64); ok {
			posttranport.DescreaseLike(appCtx, int(id), d)
		} else {
			log.Printf("Data in payloadQueue is not of type int64")
		}
	default:
		fmt.Printf("Unknown pattern: %s\n", payloadQueue.Pattern)
	}

}
