import {IBaseRes} from '../base-dto/base-res.interface';
import {IGroup} from '../base-dto/group.interface';
import {IStorageLocation} from '../base-dto/storage-location.interface';
import {FilterOperator, FilterSuffix} from '../common/paginated-filter-options';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';
import {
  TypeGetGroupProductsPaginatedFilterKey,
  TypeGetGroupProductsPaginatedFilterValue,
} from '../group-products';

export interface ICreateStorageLocationReq extends IStorageLocation {
  groupId?: string;

  group?: IGroup;

  //File
  file?: unknown;

  image?: string;
}

export interface ICreateStorageLocationRes extends IBaseRes {
  data?: IStorageLocation;
}

export interface IGetStorageLocationByIdReq {
  id: string;

  groupId: string;
}

export interface IGetStorageLocationByIdRes extends IBaseRes {
  data?: IStorageLocation;
}

//id,name,addedBy,description,timestamp.createdAt,timestamp.updatedAt,timestamp.deletedAt
export type TypeColumnGetStorageLocationsPaginated =
  | 'id'
  | 'name'
  | 'addedBy'
  | 'description'
  | 'timestamp.createdAt'
  | 'timestamp.updatedAt'
  | 'timestamp.deletedAt';

//name,addedBy,description
export type TypeGetStorageLocationsPaginatedSearchBy =
  | 'name'
  | 'addedBy'
  | 'description';

export type TypeGetStorageLocationsPaginatedSortBy =
  | `${TypeColumnGetStorageLocationsPaginated}:${'ASC' | 'DESC'}`;

export type TypeGetStorageLocationsPaginatedFilterKey =
  TypeColumnGetStorageLocationsPaginated;

export type TypeGetStorageLocationsPaginatedFilterValue =
  | `${FilterOperator}:${string}`
  | `${FilterSuffix}:${FilterOperator}:${string}`;

export interface IGetStorageLocationsPaginatedReq extends IPaginatedReq {
  searchBy?: TypeGetStorageLocationsPaginatedSearchBy[];

  sortBy?: TypeGetStorageLocationsPaginatedSortBy[];

  filter?: Partial<
    Record<
      TypeGetStorageLocationsPaginatedFilterKey,
      TypeGetStorageLocationsPaginatedFilterValue
    >
  >;
}

export interface IGetStorageLocationsPaginatedRes
  extends IPaginatedRes<IStorageLocation> {
  statusCode: number;

  message: string;
}

export interface IDeleteStorageLocationReq {
  id: string;

  groupId: string;
}

export interface IDeleteStorageLocationRes extends IBaseRes {
  data?: IStorageLocation;
}

export interface IRestoreStorageLocationByIdReq {
  id: string;

  groupId: string;
}

export interface IRestoreStorageLocationByIdRes extends IBaseRes {
  data?: IStorageLocation;
}

export interface IUpdateStorageLocationReq extends IStorageLocation {
  groupId: string;

  id: string;

  //File
  file?: unknown;

  image?: string;
}

export interface IUpdateStorageLocationRes extends IBaseRes {
  data?: IStorageLocation;
}
