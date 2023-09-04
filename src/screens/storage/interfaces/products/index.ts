import {IBaseRes} from '../base-dto/base-res.interface';
import {IProduct} from '../base-dto/product.interface';

export interface IGetProductByBarcodeReq {
  barcode: string;
}

export interface IGetProductByBarcodeRes extends IBaseRes {
  data?: IProduct;
}
