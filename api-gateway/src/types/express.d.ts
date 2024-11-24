import 'express';
import { JwtPayload } from 'src/common/stategy/accessToken.strategy';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
