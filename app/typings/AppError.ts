type AppError<TData = unknown> = {
  data: TData;
  internal: boolean;
  status: number;
  statusText: string;
};

export type { AppError };
