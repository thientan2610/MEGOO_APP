import {RouteProp} from '@react-navigation/native';

import {IPurchaseLocation} from '../../interfaces/base-dto/purchase-location.interface';
import {IStorageLocation} from '../../interfaces/base-dto/storage-location.interface';

export interface RouteParamsProductsScreen {
  groupId: string;
  storageLocation?: IStorageLocation;
  purchaseLocation?: IPurchaseLocation;
}

export type PropsProductsScreen = RouteProp<
  Record<string, RouteParamsProductsScreen>,
  string
>;
