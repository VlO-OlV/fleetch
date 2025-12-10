import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { RideClassResponse } from '@/types/ride';
import { CreateRideClassDto, UpdateRideClassDto } from '@/validation/ride';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useRideClass = ({ id }: { id?: string }) => {
  const queryClient = useQueryClient();

  const getRideClasses = useCallback(async () => {
    const response = await apiService.get<{ data: RideClassResponse[] }>(
      ApiEndpoint.RIDE_CLASSES,
    );
    return response.data;
  }, []);

  const { data: rideClasses } = useQuery({
    queryKey: [QueryKey.RIDE_CLASSES],
    queryFn: getRideClasses,
  });

  const createRideClass = useCallback(async (data: CreateRideClassDto) => {
    const response = await apiService.post<void, CreateRideClassDto>(
      ApiEndpoint.RIDE_CLASSES,
      data,
    );
    return response.data;
  }, []);

  const createRideClassMutation = useMutation({
    mutationKey: [MutationKey.CREATE_RIDE_CLASS],
    mutationFn: createRideClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RIDE_CLASSES],
      });
      toast.success('Ride class created');
    },
  });

  const updateRideClass = useCallback(
    async (data: UpdateRideClassDto) => {
      const response = await apiService.patch<void, UpdateRideClassDto>(
        ApiEndpoint.RIDE_CLASSES + `/${id}`,
        data,
      );
      return response.data;
    },
    [id],
  );

  const updateRideClassMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_RIDE_CLASS],
    mutationFn: updateRideClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RIDE_CLASSES],
      });
      toast.success('Ride class updated');
    },
  });

  const deleteRideClass = useCallback(
    async (rideClassId?: string) => {
      const response = await apiService.delete<void>(
        ApiEndpoint.RIDE_CLASSES + `/${rideClassId || id}`,
      );
      return response.data;
    },
    [id],
  );

  const deleteRideClassMutation = useMutation({
    mutationKey: [MutationKey.DELETE_RIDE_CLASS],
    mutationFn: deleteRideClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RIDE_CLASSES],
      });
      toast.success('Ride class deleted');
    },
  });

  return {
    rideClasses,
    createRideClass: createRideClassMutation.mutate,
    updateRideClass: updateRideClassMutation.mutate,
    deleteRideClass: deleteRideClassMutation.mutate,
  };
};
