export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface SortingDto<T> {
  sortingParams?: Partial<Record<keyof T, 'asc' | 'desc'>>;
}

export interface FilterDto<T> {
  filterParams?: Partial<
    Record<keyof T, string | number | boolean | null | undefined>
  >;
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
