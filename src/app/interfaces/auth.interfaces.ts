export interface IUser {
    email: string;
    authorities: IAuthority[];
  }
  
  export interface IAuthority {
    authority: string;
  }
  
  export interface ILoginResponse {
    success: boolean;
    token: string;
    authUser: IUser;
    expiresIn: number;
  }
  
  export interface IRoleType {
    admin: string;
    superAdmin: string;
  }
  
  export interface IResponse<T> {
    data: T;
    message: string,
    meta: T;
  }