import {IAddressEmbedded} from './address.embedded.interface';
import {IItem} from './item.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface IPurchaseLocation {
  id?: string;

  name?: string;

  addedBy?: string;

  address?: IAddressEmbedded;

  image?: string;

  description?: string;

  timestamp?: ITimestampEmbedded;

  items?: IItem[];
}
