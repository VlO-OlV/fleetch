import { ApiEndpoint, MutationKey, Route, StorageKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { LoginResponse } from '@/types/auth';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  VerifyCodeDto,
} from '@/validation/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useAuth = () => {
  const router = useRouter();

  const login = async (data: LoginDto) => {
    const response = await apiService.post<LoginResponse, LoginDto>(
      ApiEndpoint.LOGIN,
      data,
    );
    return response.data;
  };

  const loginMutation = useMutation({
    mutationKey: [MutationKey.LOGIN],
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      localStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
      router.push(Route.DASHBOARD);
    },
  });

  const logout = async () => {
    localStorage.removeItem(StorageKey.ACCESS_TOKEN);
    router.push(Route.LOGIN);
    await apiService.post<void, void>(ApiEndpoint.LOGOUT, undefined);
  };

  const logoutMutation = useMutation({
    mutationKey: [MutationKey.LOGOUT],
    mutationFn: logout,
  });

  const forgotPassword = async (data: ForgotPasswordDto) => {
    const response = await apiService.post<void, ForgotPasswordDto>(
      ApiEndpoint.FORGOT_PASSWORD,
      data,
    );
    return response.data;
  };

  const forgotPasswordMutation = useMutation({
    mutationKey: [MutationKey.FORGOT_PASSWORD],
    mutationFn: forgotPassword,
    onSuccess: (data, { email }) => {
      localStorage.setItem(StorageKey.RESET_PASSWORD_EMAIL, email);
      router.push(Route.PASSWORD_RESET_VERIFY);
    },
  });

  const verifyPasswordReset = async (data: VerifyCodeDto) => {
    const response = await apiService.post<LoginResponse, VerifyCodeDto>(
      ApiEndpoint.PASSWORD_RESET_VERIFY,
      data,
    );
    return response.data;
  };

  const verifyPasswordResetMutation = useMutation({
    mutationKey: [MutationKey.FORGOT_PASSWORD],
    mutationFn: verifyPasswordReset,
    onSuccess: ({ accessToken }) => {
      localStorage.removeItem(StorageKey.RESET_PASSWORD_EMAIL);
      localStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
      router.push(Route.PASSWORD_RESET);
    },
  });

  const resetPassword = async (data: ResetPasswordDto) => {
    const response = await apiService.post<void, ResetPasswordDto>(
      ApiEndpoint.RESET_PASSWORD,
      data,
    );
    return response.data;
  };

  const resetPasswordMutation = useMutation({
    mutationKey: [MutationKey.RESET_PASSWORD],
    mutationFn: resetPassword,
    onSuccess: () => {
      localStorage.removeItem(StorageKey.ACCESS_TOKEN);
      toast.success('Password updated successfully');
      router.push(Route.LOGIN);
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    verifyPasswordReset: verifyPasswordResetMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
  };
};
