export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface SortingDto<T> {
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterDto<T> {
  filterParams?: Partial<Record<keyof T, string | undefined>>;
}

export interface FindManyDto<T>
  extends PaginationDto, SortingDto<T>, FilterDto<T> {
  search?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  totalPages: number;
  page: number;
  limit: number;
}
