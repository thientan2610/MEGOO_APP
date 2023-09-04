import {IGroup} from './group.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface INewGroupProduct {
  id?: string;

  description?: string;

  image?: string;

  name?: string;

  price?: number;

  bestBefore?: Date | string;

  interval?: number;

  intervalType?: string;

  lastNotification?: Date | string;

  nextNotification?: Date | string;

  timestamp?: ITimestampEmbedded;

  group?: IGroup;
}
