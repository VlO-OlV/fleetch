import { RideClassResponse } from '../ride';

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  IN_RIDE = 'IN_RIDE',
}

export interface DriverResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber?: string;
  carNumber: string;
  totalRides: number;
  rideClass: RideClassResponse;
  rideClassId: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}
