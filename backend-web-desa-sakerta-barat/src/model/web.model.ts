export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging;
}

export class Paging {
  size: number;
  total_page: number;
  current_page: number;
  perPage?: number;
  prev?: number;
  next?: number;
}
