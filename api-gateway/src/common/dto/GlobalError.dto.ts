import { timestamp } from 'rxjs';
export type ErrorGlobalDto = {
  timestamp: Date;
  statusCode: number;
  message: any;
  log: string;
};
