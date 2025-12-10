import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { ExtraOptionResponse } from '@/types/ride';
import { CreateExtraOptionDto, UpdateExtraOptionDto } from '@/validation/ride';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useExtraOption = ({ id }: { id?: string }) => {
  const queryClient = useQueryClient();

  const getExtraOptions = useCallback(async () => {
    const response = await apiService.get<{ data: ExtraOptionResponse[] }>(
      ApiEndpoint.EXTRA_OPTIONS,
    );
    return response.data;
  }, []);

  const { data: extraOptions } = useQuery({
    queryKey: [QueryKey.EXTRA_OPTIONS],
    queryFn: getExtraOptions,
  });

  const createExtraOption = useCallback(async (data: CreateExtraOptionDto) => {
    const response = await apiService.post<void, CreateExtraOptionDto>(
      ApiEndpoint.EXTRA_OPTIONS,
      data,
    );
    return response.data;
  }, []);

  const createExtraOptionMutation = useMutation({
    mutationKey: [MutationKey.CREATE_EXTRA_OPTION],
    mutationFn: createExtraOption,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.EXTRA_OPTIONS],
      });
      toast.success('Extra option created');
    },
  });

  const updateExtraOption = useCallback(
    async (data: UpdateExtraOptionDto) => {
      const response = await apiService.patch<void, UpdateExtraOptionDto>(
        ApiEndpoint.EXTRA_OPTIONS + `/${id}`,
        data,
      );
      return response.data;
    },
    [id],
  );

  const updateExtraOptionMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_EXTRA_OPTION],
    mutationFn: updateExtraOption,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.EXTRA_OPTIONS],
      });
      toast.success('Extra option updated');
    },
  });

  const deleteExtraOption = useCallback(
    async (extraOptionId?: string) => {
      const response = await apiService.delete<void>(
        ApiEndpoint.EXTRA_OPTIONS + `/${extraOptionId || id}`,
      );
      return response.data;
    },
    [id],
  );

  const deleteExtraOptionMutation = useMutation({
    mutationKey: [MutationKey.DELETE_EXTRA_OPTION],
    mutationFn: deleteExtraOption,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.EXTRA_OPTIONS],
      });
      toast.success('Extra option deleted');
    },
  });

  return {
    extraOptions,
    createExtraOption: createExtraOptionMutation.mutate,
    updateExtraOption: updateExtraOptionMutation.mutate,
    deleteExtraOption: deleteExtraOptionMutation.mutate,
  };
};
