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
  profileImageId?: string;
  password: string;
  phoneNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: UserRole;
  state: UserState;
  createdAt: string;
  updatedAt: string;
}
