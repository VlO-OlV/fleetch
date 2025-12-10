'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DriverResponse } from '@/types/driver';
import { FilterDto, SortingDto } from '@/types';
import { useDriver } from '@/hooks/use-driver';
import { DriverStatusToDetailsMap } from '@/lib/consts';
import { DriverTableRow } from './components/DriverTableRow';
import { DriverActionDialog } from './components/DriverActionDialog';
import { DriverProfileDialog } from './components/DriverProfileDialog';
import { useRideClass } from '@/hooks/use-ride-class';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useUser } from '@/hooks/use-user';
import { UserRole } from '@/types/user';

export default function DriversPage() {
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<SortingDto<DriverResponse>>({});
  const [filter, setFilter] = useState<
    FilterDto<DriverResponse>['filterParams']
  >({});
  const [page, setPage] = useState<number>(1);
  const { t } = useI18n();

  const { drivers } = useDriver({
    page,
    filterParams: { ...filter },
    ...sort,
    search,
  });
  const { rideClasses } = useRideClass({});
  const { user } = useUser({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverResponse | null>(
    null,
  );

  const tableHeader: {
    key: keyof DriverResponse;
    label: string;
  }[] = useMemo(
    () => [
      {
        key: 'firstName',
        label: t('drivers.table.name', 'Name'),
      },
      {
        key: 'phoneNumber',
        label: t('drivers.table.phone', 'Phone'),
      },
      {
        key: 'rideClassId',
        label: t('drivers.table.rideClass', 'Ride Class'),
      },
      {
        key: 'status',
        label: t('drivers.table.status', 'Status'),
      },
      {
        key: 'totalRides',
        label: t('drivers.table.totalRides', 'Total Rides'),
      },
      {
        key: 'carNumber',
        label: t('drivers.table.carNumber', 'Car #'),
      },
    ],
    [t],
  );

  const displayedPages = useMemo(() => {
    if (!drivers?.totalPages) return [];
    if (page === 0)
      return [1, 2, 3].filter((value) => value <= drivers.totalPages);
    if (page === drivers?.totalPages)
      return [page - 2, page - 1, page].filter((value) => value > 0);
    return [page - 1, page, page + 1].filter(
      (value) => value > 0 && value <= drivers.totalPages,
    );
  }, [page, drivers]);

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">
          {t('drivers.title', 'Drivers')}
        </h1>
        <div className="flex gap-2 mb-4 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder={t('drivers.search', 'Search')}
            className="w-[300px]"
          />

          <Select
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, status: value }))
            }
            value={filter?.status}
          >
            <SelectTrigger className="w-40">
              <SelectValue
                placeholder={t('drivers.allStatuses', 'All statuses')}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(DriverStatusToDetailsMap).map(
                  ([status, { label }]) => (
                    <SelectItem key={status} value={status}>
                      {t(label, status)}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, rideClassId: value }))
            }
            value={filter?.rideClassId}
          >
            <SelectTrigger className="w-40 capitalize">
              <SelectValue
                placeholder={t('drivers.allClasses', 'All classes')}
              />
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
          {user?.role === UserRole.ADMIN && (
            <Button
              onClick={() => {
                setSelectedDriver(null);
                setIsDialogOpen(true);
              }}
              className="h-9"
            >
              {t('drivers.add', 'Add Driver')}
            </Button>
          )}
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
                <TableHead>{t('table.actions', 'Actions')}</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {drivers?.data.map((driver, index) => (
                <DriverTableRow
                  key={index}
                  driver={driver}
                  onEdit={() => {
                    setSelectedDriver(driver);
                    setIsDialogOpen(true);
                  }}
                  onOpenProfile={() => {
                    setSelectedDriver(driver);
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
                >
                  {t('pagination.prev', 'Previous')}
                </PaginationPrevious>
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
                    setPage((p) => Math.min(drivers?.totalPages || 0, p + 1))
                  }
                >
                  {t('pagination.next', 'Next')}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        {user?.role === UserRole.ADMIN && (
          <DriverActionDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            driver={selectedDriver}
          />
        )}
        <DriverProfileDialog
          isOpen={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
          driver={selectedDriver}
        />
      </main>
    </div>
  );
}
