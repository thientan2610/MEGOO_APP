import {IBaseRes} from '../base-dto/base-res.interface';
import {IItem} from '../base-dto/item.interface';
import {FilterOperator, FilterSuffix} from '../common/paginated-filter-options';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';

/** CREATE ITEM */

export interface ICreateItemReq extends IItem {
  groupProductId: string;

  storageLocationId: string;

  purchaseLocationId: string;
}

export interface ICreateItemRes extends IBaseRes {
  data?: IItem;
}

/** GET ITEM IBY IID */

export interface IGetItemByIdReq {
  groupId: string;

  id: string;
}

export interface IGetItemByIdRes extends IBaseRes {
  data?: IItem;
}

/** GET ITEMS **PAGINATED** */

//id,addedBy,bestBefore,quantity,unit,timestamp.createdAt,timestamp.updatedAt,timestamp.deletedAt,groupProduct.id,groupProduct.barcode,groupProduct.name,groupProduct.category,groupProduct.brand,groupProduct.description,groupProduct.price,groupProduct.region,purchaseLocation.id,storageLocation.id
export type TypeColumnGetItemsPaginated =
  | 'id'
  | 'addedBy'
  | 'bestBefore'
  | 'quantity'
  | 'unit'
  | 'timestamp.createdAt'
  | 'timestamp.updatedAt'
  | 'timestamp.deletedAt'
  | 'groupProduct.id'
  | 'groupProduct.barcode'
  | 'groupProduct.name'
  | 'groupProduct.category'
  | 'groupProduct.brand'
  | 'groupProduct.description'
  | 'groupProduct.price'
  | 'groupProduct.region'
  | 'purchaseLocation.id'
  | 'storageLocation.id';

//addedBy,bestBefore,quantity,unit,groupProduct.barcode,groupProduct.name,groupProduct.category,groupProduct.brand,groupProduct.description,groupProduct.price,groupProduct.region
export type TypeGetItemsPaginatedSearchBy =
  | 'addedBy'
  | 'bestBefore'
  | 'quantity'
  | 'unit'
  | 'groupProduct.barcode'
  | 'groupProduct.name'
  | 'groupProduct.category'
  | 'groupProduct.brand'
  | 'groupProduct.description'
  | 'groupProduct.price'
  | 'groupProduct.region';

export type TypeGetItemsPaginatedSortBy =
  | `${TypeColumnGetItemsPaginated}:${'ASC' | 'DESC'}`;

export type TypeGetItemsPaginatedFilterKey = TypeColumnGetItemsPaginated;

export type TypeGetItemsPaginatedFilterValue =
  | `${FilterOperator}:${string}`
  | `${FilterSuffix}:${FilterOperator}:${string}`;

export interface IGetItemsPaginatedReq extends IPaginatedReq {
  sortBy?: TypeGetItemsPaginatedSortBy[];

  searchBy?: TypeGetItemsPaginatedSearchBy[];

  filter?: Partial<
    Record<TypeGetItemsPaginatedFilterKey, TypeGetItemsPaginatedFilterValue>
  >;
}

export interface IGetItemsPaginatedRes extends IPaginatedRes<IItem> {
  statusCode: number;

  message: string;
}

/** DELETE ITEM */

export interface IDeleteItemReq {
  groupId: string;

  id: string;
}

export interface IDeleteItemRes extends IBaseRes {
  data?: IItem;
}

/** UPDATE ITEM */

export interface IUpdateItemReq extends IItem {
  groupId: string;

  id: string;
}

export interface IUpdateItemRes extends IBaseRes {
  data?: IItem;
}

/** RESTORE ITEM */

/**
 * IThe `RestoreItemReq.id` will be filled by the `` decorator in the controller.
 */
export interface IRestoreItemReq {
  groupId: string;

  id: string;
}

export interface IRestoreItemRes extends IBaseRes {
  data?: IItem;
}
