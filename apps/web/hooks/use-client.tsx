import { ApiEndpoint, MutationKey, QueryKey } from '@/lib/consts';
import apiService from '@/services/api/api.service';
import { FindManyDto, PaginationDto, PaginationResponse } from '@/types';
import { ClientResponse } from '@/types/client';
import { CreateClientDto, UpdateClientDto } from '@/validation/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useClient = ({
  id,
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  filterParams,
}: FindManyDto<ClientResponse> & { id?: string }) => {
  const queryClient = useQueryClient();

  const getClients = useCallback(async () => {
    const response = await apiService.get<PaginationResponse<ClientResponse>>(
      ApiEndpoint.CLIENTS,
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

  const { data: clientsData } = useQuery({
    queryKey: [
      QueryKey.CLIENTS,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterParams,
    ],
    queryFn: getClients,
    enabled: !!page,
  });

  const getClient = useCallback(async () => {
    const response = await apiService.get<ClientResponse>(
      ApiEndpoint.CLIENTS + `/${id}`,
    );
    return response.data;
  }, [id]);

  const { data: clientData } = useQuery({
    queryKey: [QueryKey.CLIENTS, id],
    queryFn: getClient,
    enabled: !!id,
  });

  const createClient = useCallback(async (data: CreateClientDto) => {
    const response = await apiService.post<void, CreateClientDto>(
      ApiEndpoint.CLIENTS,
      data,
    );
    return response.data;
  }, []);

  const createClientMutation = useMutation({
    mutationKey: [MutationKey.CREATE_CLIENT],
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CLIENTS],
      });
      toast.success('Client created');
    },
  });

  const updateClient = useCallback(
    async (data: UpdateClientDto) => {
      const response = await apiService.patch<void, UpdateClientDto>(
        ApiEndpoint.CLIENTS + `/${id}`,
        data,
      );
      return response.data;
    },
    [id],
  );

  const updateClientMutation = useMutation({
    mutationKey: [MutationKey.UPDATE_CLIENT],
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CLIENTS],
      });
      toast.success('Client updated');
    },
  });

  const deleteClient = useCallback(
    async (clientId?: string) => {
      const response = await apiService.delete<void>(
        ApiEndpoint.CLIENTS + `/${clientId || id}`,
      );
      return response.data;
    },
    [id],
  );

  const deleteClientMutation = useMutation({
    mutationKey: [MutationKey.DELETE_CLIENT],
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CLIENTS],
      });
      toast.success('Client deleted');
    },
  });

  return {
    client: clientData,
    clients: clientsData,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
};
