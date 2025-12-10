import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { FindManyDto, PaginationResponse } from '@/types';
import { UserResponse, UserRole } from '@/types/user';
import {
  CreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
} from '@/validation/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';

export const useUser = ({
  hideToast,
  id,
  page,
  limit,
  search,
  sortBy,
  sortOrder,
  filterParams,
}: FindManyDto<UserResponse> & { hideToast?: boolean; id?: string }) => {
  const queryClient = useQueryClient();

  const getMe = useCallback(async () => {
    const response = await apiService.get<UserResponse>(ApiEndpoint.ME, {
      hideToast,
    });
    return response.data;
  }, [hideToast]);

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.ME],
    queryFn: getMe,
  });

  const getOperators = useCallback(async () => {
    const response = await apiService.get<PaginationResponse<UserResponse>>(
      ApiEndpoint.USERS,
      {
        queryParams: {
          ...filterParams,
          sortBy,
          sortOrder,
          page,
          limit,
          search,
          role: UserRole.OPERATOR,
        },
      },
    );
    return response.data;
  }, [page, limit, search, sortBy, sortOrder, filterParams]);

  const { data: operatorsData } = useQuery({
    queryKey: [
      QueryKey.USERS,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterParams,
    ],
    queryFn: getOperators,
    enabled: !!page,
  });

  const updateMe = async (
    data: UpdateProfileDto & { profileImageId?: string | null },
  ) => {
    const response = await apiService.patch<void, UpdateProfileDto>(
      ApiEndpoint.ME,
      data,
    );
    return response.data;
  };

  const { t } = useI18n();

  const updateMeMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_ME],
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.ME] });
      toast.success(t('toast.profile.updated', 'Profile updated'));
    },
  });

  const getOperator = useCallback(async () => {
    const response = await apiService.get<UserResponse>(
      ApiEndpoint.USERS + `/${id}`,
    );
    return response.data;
  }, [id]);

  const { data: operatorData } = useQuery({
    queryKey: [QueryKey.USERS, id],
    queryFn: getOperator,
    enabled: !!id,
  });

  const createOperator = useCallback(async (data: CreateUserDto) => {
    const response = await apiService.post<void, CreateUserDto>(
      ApiEndpoint.USERS,
      data,
    );
    return response.data;
  }, []);

  const createOperatorMutation = useMutation({
    mutationKey: [MutationKey.CREATE_USER],
    mutationFn: createOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USERS] });
      toast.success(t('toast.operator.created', 'Operator created'));
    },
  });

  const updateOperator = useCallback(
    async (data: UpdateUserDto) => {
      const response = await apiService.patch<void, UpdateUserDto>(
        ApiEndpoint.USERS + `/${id}`,
        data,
      );
      return response.data;
    },
    [id],
  );

  const updateOperatorMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_USER],
    mutationFn: updateOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USERS] });
      toast.success(t('toast.operator.updated', 'Operator updated'));
    },
  });

  const deleteOperator = useCallback(
    async (operatorId?: string) => {
      const response = await apiService.delete<void>(
        ApiEndpoint.USERS + `/${id}`,
      );
      return response.data;
    },
    [id],
  );

  const deleteOperatorMutation = useMutation({
    mutationKey: [MutationKey.DELETE_USER],
    mutationFn: deleteOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USERS] });
      toast.success(t('toast.operator.deleted', 'Operator deleted'));
    },
  });

  return {
    user: data,
    isLoading,
    updateMe: updateMeMutation.mutate,
    operator: operatorData,
    operators: operatorsData,
    createOperator: createOperatorMutation.mutate,
    updateOperator: updateOperatorMutation.mutate,
    deleteOperator: deleteOperatorMutation.mutate,
  };
};
