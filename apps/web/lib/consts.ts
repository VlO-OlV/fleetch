import { DriverStatus } from '@/types/driver';
import { UserRole } from '@/types/user';

export enum ApiEndpoint {
  LOGIN = '/auth/login',
  GOOGLE_AUTH = '/auth/google/callback',
  LOGOUT = '/auth/logout',
  FORGOT_PASSWORD = '/auth/password/forgot',
  PASSWORD_RESET_VERIFY = '/auth/password/verify-reset',
  RESET_PASSWORD = '/auth/password/reset',
  REFRESH = '/auth/refresh',
  ME = '/users/me',
  FILES = '/files',
  DRIVERS = '/drivers',
  USERS = '/users',
  CLIENTS = '/clients',
  RIDES = '/rides',
  RIDE_CLASSES = '/ride-classes',
  EXTRA_OPTIONS = '/extra-options',
}

export enum Route {
  DASHBOARD = '/dashboard',
  LIVE_MAP = '/live-map',
  CLIENTS = '/clients',
  DRIVERS = '/drivers',
  ORDERS = '/orders',
  OPERATORS = '/operators',
  SETTINGS = '/settings',
  LOGIN = '/login',
  FORGOT_PASSWORD = '/forgot-password',
  PASSWORD_RESET_VERIFY = '/forgot-password/verify',
  PASSWORD_RESET = '/forgot-password/reset',
}

export enum StorageKey {
  ACCESS_TOKEN = 'accessToken',
  RESET_PASSWORD_EMAIL = 'resetPasswordEmail',
}

export enum MutationKey {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  UPDATE_ME = 'UPDATE_ME',
  UPDATE_DRIVER = 'UPDATE_DRIVER',
  CREATE_DRIVER = 'CREATE_DRIVER',
  DELETE_DRIVER = 'DELETE_DRIVER',
  CREATE_CLIENT = 'CREATE_CLIENT',
  UPDATE_CLIENT = 'UPDATE_CLIENT',
  DELETE_CLIENT = 'DELETE_CLIENT',
  CREATE_RIDE = 'CREATE_RIDE',
  UPDATE_RIDE = 'UPDATE_RIDE',
  DELETE_RIDE = 'DELETE_RIDE',
  CREATE_RIDE_CLASS = 'CREATE_RIDE_CLASS',
  UPDATE_RIDE_CLASS = 'UPDATE_RIDE_CLASS',
  DELETE_RIDE_CLASS = 'DELETE_RIDE_CLASS',
  CREATE_EXTRA_OPTION = 'CREATE_EXTRA_OPTION',
  UPDATE_EXTRA_OPTION = 'UPDATE_EXTRA_OPTION',
  DELETE_EXTRA_OPTION = 'DELETE_EXTRA_OPTION',
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

export enum QueryKey {
  ME = 'ME',
  DRIVERS = 'DRIVERS',
  CLIENTS = 'CLIENTS',
  RIDES = 'RIDES',
  USERS = 'USERS',
  RIDE_CLASSES = 'RIDE_CLASSES',
  EXTRA_OPTIONS = 'EXTRA_OPTIONS',
}

export const UserRoleToLabelMap: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.OPERATOR]: 'Operator',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export enum FileType {
  IMAGE = 'image/*',
}

export const DriverStatusToDetailsMap: Record<
  DriverStatus,
  { label: string; color: string; bgColor: string }
> = {
  [DriverStatus.ACTIVE]: {
    label: 'Active',
    color: '#00a63e',
    bgColor: '#dcfce7',
  },
  [DriverStatus.INACTIVE]: {
    label: 'Inactive',
    color: '#4a5565',
    bgColor: '#f3f4f6',
  },
  [DriverStatus.IN_RIDE]: {
    label: 'In Ride',
    color: '#155dfc',
    bgColor: '#dbeafe',
  },
};
