import {IBaseRes} from '../base-dto/base-res.interface';
import {INewGroupProduct} from '../base-dto/new-group-product.interface';
import {FilterOperator, FilterSuffix} from '../common/paginated-filter-options';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';

/** CREATE GROUP PRODUCT */
export interface ICreateNewGroupProductReq extends INewGroupProduct {
  groupId: string;

  //File
  file?: unknown;

  image?: string;
}

export interface ICreateNewGroupProductRes extends IBaseRes {
  data?: INewGroupProduct;
}

/** GET GROUP PRODUCT BY ID */

export interface IGetNewGroupProductByIdReq {
  groupId: string;

  id: string;
}

export interface IGetNewGroupProductByIdRes extends IBaseRes {
  data?: INewGroupProduct;
}

/** GET GROUP PRODUCTS **PAGINATED** */

//id,name,image,price,bestBefore,description,interval,intervalType,lastNotification,nextNotification,timestamp.createdAt,timestamp.updatedAt,timestamp.deletedAt,groupId
export type TypeColumnGetNewGroupProductsPaginated =
  | 'id'
  | 'name'
  | 'image'
  | 'price'
  | 'bestBefore'
  | 'description'
  | 'interval'
  | 'intervalType'
  | 'lastNotification'
  | 'nextNotification'
  | 'timestamp.createdAt'
  | 'timestamp.updatedAt'
  | 'timestamp.deletedAt'
  | 'groupId';

//name,image,price,bestBefore,description,interval,intervalType,lastNotification,nextNotification,groupId
export type TypeGetNewGroupProductsPaginatedSearchBy =
  | 'name'
  | 'image'
  | 'price'
  | 'bestBefore'
  | 'description'
  | 'interval'
  | 'intervalType'
  | 'lastNotification'
  | 'nextNotification'
  | 'groupId';

export type TypeGetNewGroupProductsPaginatedSortBy =
  | `${TypeColumnGetNewGroupProductsPaginated}:${'ASC' | 'DESC'}`;

export type TypeGetNewGroupProductsPaginatedFilterKey =
  TypeColumnGetNewGroupProductsPaginated;

export type TypeGetNewGroupProductsPaginatedFilterValue =
  | `${FilterOperator}:${string}`
  | `${FilterSuffix}:${FilterOperator}:${string}`;

export interface IGetNewGroupProductsPaginatedReq extends IPaginatedReq {
  sortBy?: TypeGetNewGroupProductsPaginatedSortBy[];

  searchBy?: TypeGetNewGroupProductsPaginatedSearchBy[];

  filter?: Partial<
    Record<
      TypeGetNewGroupProductsPaginatedFilterKey,
      TypeGetNewGroupProductsPaginatedFilterValue
    >
  >;
}

export interface IGetNewGroupProductsPaginatedRes
  extends IPaginatedRes<INewGroupProduct> {
  statusCode: number;

  message: string;
}

/**  DELETE GROUP PRODUCT */

export interface IDeleteNewGroupProductReq {
  groupId: string;

  id: string;
}

export interface IDeleteNewGroupProductRes extends IBaseRes {}

/** UPDATE GROUP PRODUCT */

export interface IUpdateNewGroupProductReq extends INewGroupProduct {
  groupId: string;

  //File
  file?: unknown;

  image?: string;
}

export interface IUpdateNewGroupProductRes extends IBaseRes {
  data?: INewGroupProduct;
}

/** RESTORE GROUP PRODUCT */

export interface IRestoreNewGroupProductByIdReq {
  groupId: string;

  id: string;
}

export interface IRestoreNewGroupProductByIdRes extends IBaseRes {
  data?: INewGroupProduct;
}
