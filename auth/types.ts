import { Identifier } from 'core/types';

export interface UserIdentity {
  id: Identifier;
  fullName?: string;
  avatar?: string;
  [key: string]: any;
}

export type UserCheck = (
  payload: object,
  pathName: string,
  routeParams?: object
) => void;

export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_CHECK = 'AUTH_CHECK';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_GET_PERMISSIONS = 'AUTH_GET_PERMISSIONS';

export type AuthActionType =
  | typeof AUTH_LOGIN
  | typeof AUTH_LOGOUT
  | typeof AUTH_ERROR
  | typeof AUTH_CHECK
  | typeof AUTH_GET_PERMISSIONS;

  export type AuthProvider = {
    login: (params: any) => Promise<any>;
    logout: (params: any) => Promise<void | false | string>;
    checkAuth: (params: any) => Promise<void>;
    checkError: (error: any) => Promise<void>;
    getPermissions: (params: any) => Promise<any>;
    getIdentity?: () => Promise<UserIdentity>;
    [key: string]: any;
};

export type LegacyAuthProvider = (
    type: AuthActionType,
    params?: any
) => Promise<any>;