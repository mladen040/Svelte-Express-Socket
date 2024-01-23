export type UserRole = 'Admin' | 'Normal';
export type UserGroup = 'Blue' | 'Red' | 'Green' | 'Yellow' | 'Pink';

export enum MS_EVENTS {
  LOTOUT = 'logout',
  LOGIN = 'logged-in',
  UPDATED = 'updated',
  NOTIFY_UPDATED = 'notify-updated',
  REQUEST = 'request',
  RESPONSE = 'response'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
  group: UserGroup;
  email: string;
  password: string;
}

export interface UserDto {
  firstName: string;
  lastName: string;
  role: UserRole;
  group: UserGroup;
  email: string;
  password: string;
}

export interface Product {
  id: number;
  userId: number;
  userGroup: string;
  name: string;
  description: string;
  price: number;
}

export interface ProductItem {
  id: number;
  userId: number;
  index: number;
  name: string;
  description: string;
  price: number;
}

export interface ProductDto {
  userId: number;
  userGroup: string;
  name: string;
  description: string;
  price: number;
}

export type NOTIFY_NAME = 'create' | 'update' | 'delete' | 'refresh';

export type NOTIFY_INFO = {
  user?: User;
  name: NOTIFY_NAME;
  entity: string;
  data: any;
};

export type UserRoleOptionType = {
  id: string;
  value: UserRole;
};

export const UserRoleOptions: UserRoleOptionType[] = [
  {
    id: 'admin',
    value: 'Admin'
  },
  {
    id: 'normal',
    value: 'Normal'
  }
];

export type UserGroupOptionType = {
  id: string;
  value: UserGroup;
};

export const UserGroupOptions: UserGroupOptionType[] = [
  {
    id: 'blue',
    value: 'Blue'
  },
  {
    id: 'red',
    value: 'Red'
  },
  {
    id: 'green',
    value: 'Green'
  },
  {
    id: 'yellow',
    value: 'Yellow'
  },
  {
    id: 'pink',
    value: 'Pink'
  }
];

export type UserIdOptionType = {
  id: number;
  value: number;
  email: string;
};
