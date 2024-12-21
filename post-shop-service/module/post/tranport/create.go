package posttranport

import (
	"context"
	"encoding/json"
	"log"
	"post-shop-service/common"
	appcontext "post-shop-service/component/app_context"
	postbiz "post-shop-service/module/post/biz"
	postmodel "post-shop-service/module/post/model"
	poststorage "post-shop-service/module/post/storage"

	"github.com/streadway/amqp"
)

func CreatePost(appCtx appcontext.AppContext, data *common.CreatePost, d *amqp.Delivery) {
	dataCreatePost := postmodel.CreatePost{Title: data.Title, Content: data.Content, ShopID: data.ShopID, Hashtag: data.Hashtag, Status: data.Status}
	ch := appCtx.GetChannel()
	storage := poststorage.NewSqlStore(appCtx.GetMainDBConnection())
	biz := postbiz.NewFoodCreateBiz(storage)
	var response []byte
	if err := biz.CreatePost(context.Background(), &dataCreatePost); err != nil {
		log.Printf("Failed to create post: %v", err)
		errorResponse := map[string]interface{}{
			"statusCode": 500,
			"message":    err.Error(),
		}
		response, _ := json.Marshal(errorResponse)
		err := ch.Publish(
			"",        // exchange
			d.ReplyTo, // routing key (reply-to queue)
			false,     // mandatory
			false,     // immediate
			amqp.Publishing{
				ContentType:   "application/json",
				CorrelationId: d.CorrelationId,
				Body:          response,
			},
		)
		if err != nil {
			log.Printf("Failed to publish a message: %v", err)
		}
	} else {
		response, _ = json.Marshal("Create post success")
		err := ch.Publish(
			"",        // exchange
			d.ReplyTo, // routing key (reply-to queue)
			false,     // mandatory
			false,     // immediate
			amqp.Publishing{
				ContentType:   "application/json",
				CorrelationId: d.CorrelationId,
				Body:          response,
			},
		)
		if err != nil {
			log.Printf("Failed to publish a message: %v", err)
		}
	}

}
