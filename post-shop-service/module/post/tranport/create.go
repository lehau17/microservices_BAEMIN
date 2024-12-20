package posttranport

import (
	appcontext "post-shop-service/component/app_context"

	"github.com/gin-gonic/gin"
)

func CreatePost(appCtx appcontext.AppContext) gin.HandlerFunc {
	return func(c *gin.Context) {
		

		c.JSON(200, gin.H{"message": "success"})
	}
}