import {IProduct} from '../product.interfaces';
import {IItem} from './item.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface IGroupProduct extends IProduct {
  id?: string;

  name?: string;

  image?: string;

  barcode?: string;

  price?: number;

  region?: string;

  brand?: string;

  category?: string;

  description?: string;

  timestamp?: ITimestampEmbedded;

  items?: IItem[];
}
