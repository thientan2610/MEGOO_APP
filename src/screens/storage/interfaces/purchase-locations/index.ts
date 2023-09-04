import {IBaseRes} from '../base-dto/base-res.interface';
import {IGroup} from '../base-dto/group.interface';
import {IPurchaseLocation} from '../base-dto/purchase-location.interface';
import {FilterOperator, FilterSuffix} from '../common/paginated-filter-options';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';

export interface ICreatePurchaseLocationReq extends IPurchaseLocation {
  groupId?: string;

  group?: IGroup;

  //File
  file?: unknown;

  image?: string;
}

export interface ICreatePurchaseLocationRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IGetPurchaseLocationByIdReq {
  id: string;

  groupId: string;
}

export interface IGetPurchaseLocationByIdRes extends IBaseRes {
  data?: IPurchaseLocation;
}

//id,name,addedBy,description,address.provinceName,address.districtName,address.wardName,address.addressLine1,address.addressLine2,timestamp.createdAt,timestamp.updatedAt,timestamp.deletedAt
export type TypeColumnGetPurchaseLocationsPaginated =
  | 'id'
  | 'name'
  | 'addedBy'
  | 'description'
  | 'address.provinceName'
  | 'address.districtName'
  | 'address.wardName'
  | 'address.addressLine1'
  | 'address.addressLine2'
  | 'timestamp.createdAt'
  | 'timestamp.updatedAt'
  | 'timestamp.deletedAt';

//name,addedBy,description,address.provinceName,address.districtName,address.wardName,address.addressLine1,address.addressLine2
export type TypeGetPurchaseLocationsPaginatedSearchBy =
  | 'name'
  | 'addedBy'
  | 'description'
  | 'address.provinceName'
  | 'address.districtName'
  | 'address.wardName'
  | 'address.addressLine1'
  | 'address.addressLine2';

export type TypeGetPurchaseLocationsPaginatedSortBy =
  | `${TypeColumnGetPurchaseLocationsPaginated}:${'ASC' | 'DESC'}`;

export type TypeGetPurchaseLocationsPaginatedFilterKey =
  | `${TypeColumnGetPurchaseLocationsPaginated}`;

export type TypeGetGroupProductsPaginatedFilterValue =
  | `${FilterOperator}:${string}`
  | `${FilterSuffix}:${FilterOperator}:${string}`;

export interface IGetPurchaseLocationsPaginatedReq extends IPaginatedReq {
  searchBy?: TypeGetPurchaseLocationsPaginatedSearchBy[];

  sortBy?: TypeGetPurchaseLocationsPaginatedSortBy[];

  filter?: Partial<
    Record<
      TypeGetPurchaseLocationsPaginatedFilterKey,
      TypeGetGroupProductsPaginatedFilterValue
    >
  >;
}

export interface IGetPurchaseLocationsPaginatedRes
  extends IPaginatedRes<IPurchaseLocation> {
  statusCode: number;

  message: string;
}

export interface IDeletePurchaseLocationReq {
  id: string;

  groupId: string;
}

export interface IDeletePurchaseLocationRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IRestorePurchaseLocationByIdReq {
  id: string;

  groupId: string;
}

export interface IRestorePurchaseLocationByIdRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IUpdatePurchaseLocationReq extends IPurchaseLocation {
  groupId: string;

  id: string;

  //File
  file?: unknown;

  image?: string;
}

export interface IUpdatePurchaseLocationRes extends IBaseRes {
  data?: IPurchaseLocation;
}
