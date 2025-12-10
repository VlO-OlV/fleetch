'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { FilterDto, SortingDto } from '@/types';
import { ClientResponse } from '@/types/client';
import { useClient } from '@/hooks/use-client';
import { ClientTableRow } from './components/ClientTableRow';
import { ClientProfileDialog } from './components/ClientProfileDialog';
import { ClientActionDialog } from './components/ClientActionDialog';

export default function ClientsPage() {
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<SortingDto<ClientResponse>>({});
  const [filter, setFilter] = useState<
    FilterDto<ClientResponse>['filterParams']
  >({});
  const [page, setPage] = useState<number>(1);

  const { clients } = useClient({
    page,
    filterParams: { ...filter },
    ...sort,
    search,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(
    null,
  );

  const tableHeader: {
    key: keyof ClientResponse;
    label: string;
  }[] = useMemo(
    () => [
      {
        key: 'firstName',
        label: 'Name',
      },
      {
        key: 'phoneNumber',
        label: 'Phone',
      },
      {
        key: 'createdAt',
        label: 'Date',
      },
      {
        key: 'totalRides',
        label: 'Total Rides',
      },
    ],
    [],
  );

  const displayedPages = useMemo(() => {
    if (!clients?.totalPages) return [];
    if (page === 0)
      return [1, 2, 3].filter((value) => value <= clients.totalPages);
    if (page === clients?.totalPages)
      return [page - 2, page - 1, page].filter((value) => value > 0);
    return [page - 1, page, page + 1].filter(
      (value) => value > 0 && value <= clients.totalPages,
    );
  }, [page, clients]);

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Clients</h1>
        <div className="flex gap-2 mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search"
            className="w-[300px]"
          />
          <Button
            onClick={() => {
              setSelectedClient(null);
              setIsDialogOpen(true);
            }}
            className="h-9"
          >
            Add Client
          </Button>
        </div>
        <div className="rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <tr>
                {tableHeader.map(({ key, label }, index) => (
                  <TableHead
                    key={index}
                    onClick={() =>
                      setSort((prev) => ({
                        sortBy: key,
                        sortOrder:
                          prev.sortBy === key
                            ? prev.sortOrder === 'asc'
                              ? 'desc'
                              : 'asc'
                            : 'asc',
                      }))
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex gap-2 items-center">
                      <p>{label}</p>
                      {sort.sortBy === key &&
                        (sort.sortOrder === 'asc' ? (
                          <ChevronUpIcon size={18} />
                        ) : (
                          sort.sortOrder === 'desc' && (
                            <ChevronDownIcon size={18} />
                          )
                        ))}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[150px]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {clients?.data.map((client, index) => (
                <ClientTableRow
                  key={index}
                  client={client}
                  onEdit={() => {
                    setSelectedClient(client);
                    setIsDialogOpen(true);
                  }}
                  onOpenProfile={() => {
                    setSelectedClient(client);
                    setIsProfileDialogOpen(true);
                  }}
                />
              ))}
            </TableBody>
          </Table>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {displayedPages.map((value) => (
                <PaginationItem key={value}>
                  <PaginationLink
                    isActive={page === value}
                    onClick={() => setPage(value)}
                  >
                    {value}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(clients?.totalPages || 0, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <ClientProfileDialog
          isOpen={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
          client={selectedClient}
        />
        <ClientActionDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          client={selectedClient}
        />
      </main>
    </div>
  );
}
