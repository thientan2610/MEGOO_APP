// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Order<T> = [string, 'ASC' | 'DESC'];

export type SortBy<T> = Order<T>[];

export declare interface IPaginatedRes<T> {
  data: T[];

  meta?: {
    itemsPerPage?: number;

    totalItems?: number;

    currentPage?: number;

    totalPages?: number;

    sortBy?: SortBy<T>;

    searchBy?: string[];

    search?: string;

    select?: string[];

    filter?: {
      [column: string]: string | string[];
    };
  };

  links?: {
    first?: string;

    previous?: string;

    current?: string;

    next?: string;

    last?: string;
  };
}
