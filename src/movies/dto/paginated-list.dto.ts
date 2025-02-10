export class PaginatedListDto<T> {
  data: T;
  total: number;
  page: number;
  lastPage: number;
}
