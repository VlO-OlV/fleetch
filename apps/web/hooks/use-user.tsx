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

export const useUser = ({
  hideToast,
  id,
  page,
  limit,
  search,
  sortingParams,
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
          ...sortingParams,
          ...filterParams,
          page,
          limit,
          search,
          role: UserRole.OPERATOR,
        },
      },
    );
    return response.data;
  }, [page, limit, search, sortingParams, filterParams]);

  const { data: operatorsData } = useQuery({
    queryKey: [
      QueryKey.USERS,
      page,
      limit,
      search,
      sortingParams,
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

  const updateMeMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_ME],
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.ME] });
      toast.success('Profile updated');
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
      toast.success('Operator created');
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
      toast.success('Operator updated');
    },
  });

  const deleteOperator = useCallback(async () => {
    const response = await apiService.delete<void>(
      ApiEndpoint.USERS + `/${id}`,
    );
    return response.data;
  }, [id]);

  const deleteOperatorMutation = useMutation({
    mutationKey: [MutationKey.DELETE_USER],
    mutationFn: deleteOperator,
    onSuccess: () => {
      toast.success('Operator deleted');
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
