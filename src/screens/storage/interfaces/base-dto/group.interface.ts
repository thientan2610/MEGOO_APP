import {IGroupProduct} from './group-product.interface';
import {IPurchaseLocation} from './purchase-location.interface';
import {IStorageLocation} from './storage-location.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface IGroup {
  id?: string;

  groupProducts?: IGroupProduct[];

  purchaseLocations?: IPurchaseLocation[];

  storageLocations?: IStorageLocation[];

  timestamp?: ITimestampEmbedded;
}
