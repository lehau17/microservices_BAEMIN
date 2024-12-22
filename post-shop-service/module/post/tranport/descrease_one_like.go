package posttranport

import (
	"context"
	"encoding/json"
	"post-shop-service/common"
	httpstatus "post-shop-service/common/http_status"
	appcontext "post-shop-service/component/app_context"
	"post-shop-service/component/publish"
	postbiz "post-shop-service/module/post/biz"
	poststorage "post-shop-service/module/post/storage"

	"github.com/streadway/amqp"
)

func DescreaseLike(appCtx appcontext.AppContext, post_id int, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := poststorage.NewSqlStore(appCtx.GetMainDBConnection())
	biz := postbiz.NewDescreaseLikePostBiz(storage)
	var response []byte
	err := biz.DescreaseLike(context.Background(), post_id)
	if err != nil {
		errorResponse, ok := err.(common.RpcErrorResponse)
		if ok {
			response, _ = json.Marshal(errorResponse)
		} else {
			errorResponse = common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
			response, _ = json.Marshal(errorResponse)
		}
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	} else {
		response, _ = json.Marshal(true)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}
}
