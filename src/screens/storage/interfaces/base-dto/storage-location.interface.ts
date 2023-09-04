import {IItem} from './item.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface IStorageLocation {
  id?: string;

  name?: string;

  addedBy?: string;

  image?: string;

  description?: string;

  items?: IItem[];

  timestamp?: ITimestampEmbedded;
}
