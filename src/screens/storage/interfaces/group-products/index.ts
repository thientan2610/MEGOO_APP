import {IBaseRes} from '../base-dto/base-res.interface';
import {IGroupProduct} from '../base-dto/group-product.interface';
import {FilterOperator, FilterSuffix} from '../common/paginated-filter-options';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';

/** CREATE GROUP PRODUCT */
export interface ICreateGroupProductReq extends IGroupProduct {
  groupId: string;

  //File
  file?: unknown;

  image?: string;
}

export interface ICreateGroupProductRes extends IBaseRes {
  data?: IGroupProduct;
}

/** GET GROUP PRODUCT BY ID */

export interface IGetGroupProductByIdReq {
  groupId: string;

  id: string;
}

export interface IGetGroupProductByIdRes extends IBaseRes {
  data?: IGroupProduct;
}

/** GET GROUP PRODUCTS **PAGINATED** */

//id,barcode,name,category,brand,description,price,region,timestamp.createdAt,timestamp.updatedAt,timestamp.deletedAt
export type TypeColumnGetGroupProductsPaginated =
  | 'id'
  | 'barcode'
  | 'name'
  | 'category'
  | 'brand'
  | 'description'
  | 'price'
  | 'region'
  | 'timestamp.createdAt'
  | 'timestamp.updatedAt'
  | 'timestamp.deletedAt';

//barcode,name,category,brand,description,price,region
export type TypeGetGroupProductsPaginatedSearchBy =
  | 'barcode'
  | 'name'
  | 'category'
  | 'brand'
  | 'description'
  | 'price'
  | 'region';

export type TypeGetGroupProductsPaginatedSortBy =
  | `${TypeColumnGetGroupProductsPaginated}:${'ASC' | 'DESC'}`;

export type TypeGetGroupProductsPaginatedFilterKey =
  TypeColumnGetGroupProductsPaginated;

export type TypeGetGroupProductsPaginatedFilterValue =
  | `${FilterOperator}:${string}`
  | `${FilterSuffix}:${FilterOperator}:${string}`;

export interface IGetGroupProductsPaginatedReq extends IPaginatedReq {
  sortBy?: TypeGetGroupProductsPaginatedSortBy[];

  searchBy?: TypeGetGroupProductsPaginatedSearchBy[];

  filter?: Partial<
    Record<
      TypeGetGroupProductsPaginatedFilterKey,
      TypeGetGroupProductsPaginatedFilterValue
    >
  >;
}

export interface IGetGroupProductsPaginatedRes
  extends IPaginatedRes<IGroupProduct> {
  statusCode: number;

  message: string;
}

/**  DELETE GROUP PRODUCT */

export interface IDeleteGroupProductReq {
  groupId: string;

  id: string;
}

export interface IDeleteGroupProductRes extends IBaseRes {}

/** UPDATE GROUP PRODUCT */

export interface IUpdateGroupProductReq extends IGroupProduct {
  groupId: string;

  //File
  file?: unknown;

  image?: string;
}

export interface IUpdateGroupProductRes extends IBaseRes {
  data?: IGroupProduct;
}

/** RESTORE GROUP PRODUCT */

export interface IRestoreGroupProductByIdReq {
  groupId: string;

  id: string;
}

export interface IRestoreGroupProductByIdRes extends IBaseRes {
  data?: IGroupProduct;
}
