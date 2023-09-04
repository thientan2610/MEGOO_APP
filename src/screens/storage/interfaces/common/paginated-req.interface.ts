export interface IPaginatedReq {
  page?: number;

  limit?: number;

  sortBy?: string[];

  searchBy?: string[];

  search?: string;

  filter?: Partial<Record<string, string | string[]>>;

  select?: string[];

  path?: string;

  groupId: string;
}
