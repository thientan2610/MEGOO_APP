import {SortBy} from '../interfaces/common/paginated-res.interface';

export const getSortByQueryParams = (inp: SortBy<unknown>): string[] => {
  return inp.map(i => `${i[0]}:${i[1]}`);
};
