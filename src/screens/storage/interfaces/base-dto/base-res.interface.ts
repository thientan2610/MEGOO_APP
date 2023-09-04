export interface IBaseRes {
  statusCode: number;

  message: string;

  errCode?: string;

  error?: string;

  data?: unknown;
}
