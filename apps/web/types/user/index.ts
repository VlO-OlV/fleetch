export enum UserRole {
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
}

export enum UserState {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
}

export interface UserResponse {
  id: string;
  email: string;
  profileImageId: string | null;
  password: string;
  phoneNumber: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  role: UserRole;
  state: UserState;
  createdAt: string;
  updatedAt: string;
}
