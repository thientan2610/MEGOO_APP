export interface IPackage {
    _id: string;
    name: string;
    duration: number;
    price: number;
    noOfMember: number;
    description: string;
}

export interface IPackages {
    _id: string;
    name?: string;
    duration: number;
    price?: number;
    noOfMember: number;
    description?: string;
    quantity: number;
}

export interface IUserCart {
    cart: IPackages[]
}

export interface ICartItem {
    package: string,
    quantity: number,
    noOfMember: number,
    duration: number,
}

export interface ICartList {
    cart: ICartItem[],
}

