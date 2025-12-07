import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApiEndpoint } from './consts';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getFileUrl = (fileId: string) => {
  return process.env.NEXT_PUBLIC_BACKEND_URL + ApiEndpoint.FILES + `/${fileId}`;
};

export const formatName = (
  firstName: string,
  middleName: string | undefined,
  lastName: string,
) => {
  return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
};
