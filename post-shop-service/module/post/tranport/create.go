package posttranport

import (
	"context"
	"encoding/json"
	"log"
	"post-shop-service/common"
	appcontext "post-shop-service/component/app_context"
	"post-shop-service/component/publish"
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
	id, err := biz.CreatePost(context.Background(), &dataCreatePost)
	if err != nil {
		errorResponse := common.NewSqlErrorResponse(err)
		response, _ := json.Marshal(errorResponse)

		publishPayload := publish.NewPublishPayload("", d.ReplyTo, false, false, amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: d.CorrelationId,
			Body:          response,
		})

		err := publish.Publish(ch, publishPayload)
		if err != nil {
			log.Printf("Failed to publish a message: %v", err)
		}
	} else {
		response, _ = json.Marshal(map[string]interface{}{"id": id})
		publishPayload := publish.NewPublishPayload("", d.ReplyTo, false, false, amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: d.CorrelationId,
			Body:          response,
		})
		err := publish.Publish(ch, publishPayload)

		if err != nil {
			log.Printf("Failed to publish a message: %v", err)
		}
	}

}
