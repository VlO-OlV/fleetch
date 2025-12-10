import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { FindManyDto, PaginationResponse } from '@/types';
import { RideResponse } from '@/types/ride';
import { CreateRideDto, UpdateRideDto } from '@/validation/ride';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useRide = ({
  id,
  page,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  filterParams,
}: FindManyDto<RideResponse> & { id?: string }) => {
  const queryClient = useQueryClient();

  const getGeneralStats = useCallback(async () => {
    const response = await apiService.get<{
      rideCount: number;
      clientCount: number;
      driverCount: number;
    }>(ApiEndpoint.RIDES_STATS);
    return response.data;
  }, []);

  const { data: generalStats } = useQuery({
    queryKey: [QueryKey.RIDES_STATS, 'general'],
    queryFn: getGeneralStats,
  });

  const getPaymentTypeStats = useCallback(async () => {
    const response = await apiService.get<{
      cashCount: number;
      cardCount: number;
      cryptoCount: number;
    }>(ApiEndpoint.RIDES_STATS + '/payment-type');
    return response.data;
  }, []);

  const { data: paymentTypeStats } = useQuery({
    queryKey: [QueryKey.RIDES_STATS, 'payment-type'],
    queryFn: getPaymentTypeStats,
  });

  const getIncomeStats = useCallback(async () => {
    const response = await apiService.get<
      {
        totalIncome?: number;
        rideClass?: string;
      }[]
    >(ApiEndpoint.RIDES_STATS + '/ride-class');
    return response.data;
  }, []);

  const { data: incomeStats } = useQuery({
    queryKey: [QueryKey.RIDES_STATS, 'income'],
    queryFn: getIncomeStats,
  });

  const getRides = useCallback(async () => {
    const response = await apiService.get<PaginationResponse<RideResponse>>(
      ApiEndpoint.RIDES,
      {
        queryParams: {
          ...filterParams,
          sortBy,
          sortOrder,
          page,
          limit,
          search,
        },
      },
    );
    return response.data;
  }, [page, limit, search, sortBy, sortOrder, filterParams]);

  const { data: ridesData } = useQuery({
    queryKey: [
      QueryKey.RIDES,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterParams,
    ],
    queryFn: getRides,
    enabled: !!page,
  });

  const getRide = useCallback(async () => {
    const response = await apiService.get<RideResponse>(
      ApiEndpoint.RIDES + `/${id}`,
    );
    return response.data;
  }, [id]);

  const { data: rideData } = useQuery({
    queryKey: [QueryKey.RIDES, id],
    queryFn: getRide,
    enabled: !!id,
  });

  const createRide = useCallback(async (data: CreateRideDto) => {
    const response = await apiService.post<void, CreateRideDto>(
      ApiEndpoint.RIDES,
      data,
    );
    return response.data;
  }, []);

  const createRideMutation = useMutation({
    mutationKey: [MutationKey.CREATE_RIDE],
    mutationFn: createRide,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RIDES],
      });
      toast.success('Ride created');
    },
  });

  const updateRide = useCallback(
    async (data: UpdateRideDto) => {
      const response = await apiService.patch<void, UpdateRideDto>(
        ApiEndpoint.RIDES + `/${id}`,
        data,
      );
      return response.data;
    },
    [id],
  );

  const updateRideMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_RIDE],
    mutationFn: updateRide,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RIDES],
      });
      toast.success('Ride updated');
    },
  });

  const deleteRide = useCallback(
    async (rideId?: string) => {
      const response = await apiService.delete<void>(
        ApiEndpoint.RIDES + `/${rideId || id}`,
      );
      return response.data;
    },
    [id],
  );

  const deleteRideMutation = useMutation({
    mutationKey: [MutationKey.DELETE_RIDE],
    mutationFn: deleteRide,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RIDES],
      });
      toast.success('Ride deleted');
    },
  });

  return {
    generalStats,
    paymentTypeStats,
    incomeStats,
    ride: rideData,
    rides: ridesData,
    createRide: createRideMutation.mutate,
    updateRide: updateRideMutation.mutate,
    deleteRide: deleteRideMutation.mutate,
  };
};
