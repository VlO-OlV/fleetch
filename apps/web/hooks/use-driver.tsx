import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { FindManyDto, PaginationDto, PaginationResponse } from '@/types';
import { DriverResponse } from '@/types/driver';
import { CreateDriverDto, UpdateDriverDto } from '@/validation/driver';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useDriver = ({
  id,
  page,
  limit = 10,
  search,
  sortingParams,
  filterParams,
}: FindManyDto<DriverResponse> & { id?: string }) => {
  const getDrivers = useCallback(async () => {
    const response = await apiService.get<PaginationResponse<DriverResponse>>(
      ApiEndpoint.DRIVERS,
      {
        queryParams: {
          ...sortingParams,
          ...filterParams,
          page,
          limit,
          search,
        },
      },
    );
    return response.data;
  }, [page, limit, search, sortingParams, filterParams]);

  const { data: driversData } = useQuery({
    queryKey: [
      QueryKey.DRIVERS,
      page,
      limit,
      search,
      sortingParams,
      filterParams,
    ],
    queryFn: getDrivers,
    enabled: !!page,
  });

  const getDriver = useCallback(async () => {
    const response = await apiService.get<DriverResponse>(
      ApiEndpoint.DRIVERS + `/${id}`,
    );
    return response.data;
  }, [id]);

  const { data: driverData } = useQuery({
    queryKey: [QueryKey.DRIVERS, id],
    queryFn: getDriver,
    enabled: !!id,
  });

  const createDriver = useCallback(async (data: CreateDriverDto) => {
    const response = await apiService.post<void, CreateDriverDto>(
      ApiEndpoint.DRIVERS,
      data,
    );
    return response.data;
  }, []);

  const createDriverMutation = useMutation({
    mutationKey: [MutationKey.CREATE_DRIVER],
    mutationFn: createDriver,
    onSuccess: () => {
      toast.success('Driver created');
    },
  });

  const updateDriver = useCallback(
    async (data: UpdateDriverDto) => {
      const response = await apiService.patch<void, UpdateDriverDto>(
        ApiEndpoint.DRIVERS + `/${id}`,
        data,
      );
      return response.data;
    },
    [id],
  );

  const updateDriverMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_DRIVER],
    mutationFn: updateDriver,
    onSuccess: () => {
      toast.success('Driver updated');
    },
  });

  const deleteDriver = useCallback(async () => {
    const response = await apiService.delete<void>(
      ApiEndpoint.DRIVERS + `/${id}`,
    );
    return response.data;
  }, [id]);

  const deleteDriverMutation = useMutation({
    mutationKey: [MutationKey.DELETE_DRIVER],
    mutationFn: deleteDriver,
    onSuccess: () => {
      toast.success('Driver deleted');
    },
  });

  return {
    driver: driverData,
    drivers: driversData,
    createDriver: createDriverMutation.mutate,
    updateDriver: updateDriverMutation.mutate,
    deleteDriver: deleteDriverMutation.mutate,
  };
};
