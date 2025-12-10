import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { FindManyDto, PaginationDto, PaginationResponse } from '@/types';
import { DriverResponse } from '@/types/driver';
import { CreateDriverDto, UpdateDriverDto } from '@/validation/driver';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';

export const useDriver = ({
  id,
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  filterParams,
}: FindManyDto<DriverResponse> & { id?: string }) => {
  const queryClient = useQueryClient();

  const getDrivers = useCallback(async () => {
    const response = await apiService.get<PaginationResponse<DriverResponse>>(
      ApiEndpoint.DRIVERS,
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

  const { data: driversData } = useQuery({
    queryKey: [
      QueryKey.DRIVERS,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
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

  const { t } = useI18n();

  const createDriverMutation = useMutation({
    mutationKey: [MutationKey.CREATE_DRIVER],
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.DRIVERS],
      });
      toast.success(t('toast.driver.created', 'Driver created'));
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
      queryClient.invalidateQueries({
        queryKey: [QueryKey.DRIVERS],
      });
      toast.success(t('toast.driver.updated', 'Driver updated'));
    },
  });

  const deleteDriver = useCallback(
    async (driverId?: string) => {
      const response = await apiService.delete<void>(
        ApiEndpoint.DRIVERS + `/${driverId || id}`,
      );
      return response.data;
    },
    [id],
  );

  const deleteDriverMutation = useMutation({
    mutationKey: [MutationKey.DELETE_DRIVER],
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.DRIVERS],
      });
      toast.success(t('toast.driver.deleted', 'Driver deleted'));
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
