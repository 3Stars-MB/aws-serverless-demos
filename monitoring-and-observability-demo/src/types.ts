export interface DataItem {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}