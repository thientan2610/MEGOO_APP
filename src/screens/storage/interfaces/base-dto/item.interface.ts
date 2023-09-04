import {IGroupProduct} from './group-product.interface';
import {IPurchaseLocation} from './purchase-location.interface';
import {IStorageLocation} from './storage-location.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface IItem {
  id?: string;

  groupProduct?: IGroupProduct;

  purchaseLocation?: IPurchaseLocation;

  storageLocation?: IStorageLocation;

  addedBy?: string;

  bestBefore?: string;

  quantity?: number;

  unit?: string;

  image?: string;

  timestamp?: ITimestampEmbedded;
}
