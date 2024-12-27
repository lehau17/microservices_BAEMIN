export class VideoDto {
  id: number;
  shop_id: number;
  title: string;
  url: string;
  total_view: number | null;
  total_like: number | null;
  total_share: number | null;
  total_comments: number | null;
  state_video: string;
  state_comment: string;
  is_publish_total_like: boolean;
  is_publish_total_share: boolean;
  is_allow_share: boolean;
  is_allow_dowload: boolean;
  status: number | null;
  created_at: string;
  updated_at: string;
}
