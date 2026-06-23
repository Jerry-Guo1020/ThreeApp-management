export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export async function request<T>(data: T): Promise<ApiResponse<T>> {
  return {
    code: 0,
    message: 'ok',
    data,
  }
}
