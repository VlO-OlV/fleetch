import { DriverStatus } from '@/types/driver';
import { LocationType, PaymentType, RideStatus } from '@/types/ride';
import { UserRole, UserState } from '@/types/user';

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
  RIDES_STATS = '/rides/stats',
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
  RIDES_STATS = 'RIDES_STATS',
  USERS = 'USERS',
  RIDE_CLASSES = 'RIDE_CLASSES',
  EXTRA_OPTIONS = 'EXTRA_OPTIONS',
}

export const UserRoleToLabelMap: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'userRole.admin',
  [UserRole.OPERATOR]: 'userRole.operator',
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
    label: 'driverStatus.active',
    color: '#00a63e',
    bgColor: '#dcfce7',
  },
  [DriverStatus.INACTIVE]: {
    label: 'driverStatus.inactive',
    color: '#4a5565',
    bgColor: '#f3f4f6',
  },
  [DriverStatus.IN_RIDE]: {
    label: 'driverStatus.inRide',
    color: '#155dfc',
    bgColor: '#dbeafe',
  },
};

export const UserStateToDetailsMap: Record<
  UserState,
  { label: string; color: string; bgColor: string }
> = {
  [UserState.PENDING]: {
    label: 'userState.pending',
    color: '#d97706',
    bgColor: '#ffedd5',
  },
  [UserState.VERIFIED]: {
    label: 'userState.verified',
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
};

export const RideStatusToDetailsMap: Record<
  RideStatus,
  { label: string; color: string; bgColor: string }
> = {
  [RideStatus.PENDING]: {
    label: 'rideStatus.pending',
    color: '#d97706',
    bgColor: '#ffedd5',
  },
  [RideStatus.IN_PROGRESS]: {
    label: 'rideStatus.inProgress',
    color: '#155dfc',
    bgColor: '#dbeafe',
  },
  [RideStatus.COMPLETED]: {
    label: 'rideStatus.completed',
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  [RideStatus.UPCOMING]: {
    label: 'rideStatus.upcoming',
    color: '#0ea5e9',
    bgColor: '#d0f0fd',
  },
  [RideStatus.CANCELLED]: {
    label: 'rideStatus.cancelled',
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  [RideStatus.CANCELLED_BY_DRIVER]: {
    label: 'rideStatus.cancelledByDriver',
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
};

export const PaymentTypeToDetailsMap: Record<
  PaymentType,
  { label: string; color: string; bgColor: string }
> = {
  [PaymentType.CASH]: {
    label: 'paymentType.cash',
    color: '#4b5563',
    bgColor: '#f3f4f6',
  },
  [PaymentType.CARD]: {
    label: 'paymentType.card',
    color: '#0ea5e9',
    bgColor: '#d0f0fd',
  },
  [PaymentType.CRYPTO]: {
    label: 'paymentType.crypto',
    color: '#a855f7',
    bgColor: '#f3e8ff',
  },
};

export const LocationTypeToLabelMap: Record<LocationType, string> = {
  [LocationType.START]: 'locationType.start',
  [LocationType.INTERMEDIATE]: 'locationType.intermediate',
  [LocationType.END]: 'locationType.end',
};
