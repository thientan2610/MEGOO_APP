export interface IToken {
    accessToken: string;
    refreshToken: string;
}

export interface IJWTToken {
    iat: string;
    exp: number;
}
