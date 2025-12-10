import { ClientResponse } from '../client';
import { DriverResponse } from '../driver';
import { UserResponse } from '../user';

export enum RideStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  UPCOMING = 'UPCOMING',
  CANCELLED = 'CANCELLED',
  CANCELLED_BY_DRIVER = 'CANCELLED_BY_DRIVER',
}

export enum PaymentType {
  CASH = 'CASH',
  CARD = 'CARD',
  CRYPTO = 'CRYPTO',
}

export interface RideResponse {
  id: string;
  operator?: UserResponse;
  operatorId?: string;
  driver?: DriverResponse;
  driverId?: string;
  rideClass: RideClassResponse;
  rideClassId: string;
  client?: ClientResponse;
  clientId?: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: RideStatus;
  paymentType: PaymentType;
  rideExtraOptions?: ExtraOptionResponse[];
  locations?: Location[];
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum LocationType {
  START = 'START',
  INTERMEDIATE = 'INTERMEDIATE',
  END = 'END',
}

export interface Location {
  id: string;
  rideId: string;
  latitude: number;
  longitude: number;
  address: string;
  type: LocationType;
  createdAt: string;
  updatedAt: string;
}

export interface RideClassResponse {
  id: string;
  name: string;
  priceCoefficient: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExtraOptionResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
