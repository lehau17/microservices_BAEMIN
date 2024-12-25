import { StateComment, StateVideo } from '@prisma/client';

export class CreateVideoDto {
  shop_id: number;
  title: string;
  url: string;
  state_video?: StateVideo;
  state_comment?: StateComment;
  is_publish_total_like?: boolean;
  is_publish_total_share?: boolean;
  is_allow_share?: boolean;
  is_allow_dowload?: boolean;
}
