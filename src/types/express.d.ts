import type { JwtPayload } from '../auth/auth.service.ts';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
