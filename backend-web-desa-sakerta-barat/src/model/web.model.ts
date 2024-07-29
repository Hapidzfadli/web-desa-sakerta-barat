export class WebResponse<T> {
  data?: T;
  errors?: string;
  message?: string;
  paging?: Paging;
}

export class Paging {
  size: number;
  total_page: number;
  current_page: number;
  total?: number;
  perPage?: number;
  prev?: number;
  next?: number;
}
