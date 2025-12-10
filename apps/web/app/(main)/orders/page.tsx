'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/app/(main)/components/StatusBadge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FilterDto, SortingDto } from '@/types';
import { RideResponse } from '@/types/ride';
import { useRide } from '@/hooks/use-ride';
import { PaymentTypeToDetailsMap, RideStatusToDetailsMap } from '@/lib/consts';
import { useRideClass } from '@/hooks/use-ride-class';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { OrderTableRow } from './components/OrderTableRow';

export default function OrdersPage() {
  const router = useRouter();

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<SortingDto<RideResponse>>({});
  const [filter, setFilter] = useState<FilterDto<RideResponse>['filterParams']>(
    {},
  );
  const [page, setPage] = useState<number>(1);

  const { rides } = useRide({
    page,
    filterParams: { ...filter },
    ...sort,
    search,
  });
  const { rideClasses } = useRideClass({});

  const tableHeader: {
    key: keyof RideResponse;
    label: string;
  }[] = useMemo(
    () => [
      {
        key: 'clientId',
        label: 'Client',
      },
      {
        key: 'driverId',
        label: 'Driver',
      },
      {
        key: 'operatorId',
        label: 'Operator',
      },
      {
        key: 'status',
        label: 'Status',
      },
      {
        key: 'paymentType',
        label: 'Payment',
      },
      {
        key: 'totalPrice',
        label: 'Total Price',
      },
      {
        key: 'rideClassId',
        label: 'Ride Class',
      },
    ],
    [],
  );

  const displayedPages = useMemo(() => {
    if (!rides?.totalPages) return [];
    if (page === 0)
      return [1, 2, 3].filter((value) => value <= rides.totalPages);
    if (page === rides?.totalPages)
      return [page - 2, page - 1, page].filter((value) => value > 0);
    return [page - 1, page, page + 1].filter(
      (value) => value > 0 && value <= rides.totalPages,
    );
  }, [page, rides]);

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        <div className="flex gap-2 mb-4 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search"
            className="w-[320px]"
          />
          <Select
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, status: value }))
            }
            value={filter?.status}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(RideStatusToDetailsMap).map(
                  ([status, { label }]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, paymentType: value }))
            }
            value={filter?.paymentType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(PaymentTypeToDetailsMap).map(
                  ([status, { label }]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, rideClass: value }))
            }
            value={filter?.rideClass}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {rideClasses?.data.map((rideClass) => (
                  <SelectItem key={rideClass.id} value={rideClass.id}>
                    {rideClass.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={() => router.push('/orders/create')} className="h-9">
            Create a ride
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
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {rides?.data.map((ride, index) => (
                <OrderTableRow key={index} ride={ride} />
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
                    setPage((p) => Math.min(rides?.totalPages || 0, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
}
