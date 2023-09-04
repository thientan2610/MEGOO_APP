export interface IEditInfoReq {
    name?: string;
    phone?: string;
    dob?: string;
}

export interface IEditInfoRes {
    statusCode: number;
    message: string;
    data?: any;
}