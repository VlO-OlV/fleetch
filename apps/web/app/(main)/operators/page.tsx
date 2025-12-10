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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { FilterDto, SortingDto } from '@/types';
import { UserResponse } from '@/types/user';
import { useUser } from '@/hooks/use-user';
import { UserStateToDetailsMap } from '@/lib/consts';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { OperatorTableRow } from './components/OperatorTableRow';
import { OperatorProfileDialog } from './components/OperatorProfileDialog';
import { OpearatorActionDialog } from './components/OperatorActionDialog';

export default function OperatorsPage() {
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<SortingDto<UserResponse>>({});
  const [filter, setFilter] = useState<FilterDto<UserResponse>['filterParams']>(
    {},
  );
  const [page, setPage] = useState<number>(1);

  const { operators } = useUser({
    page,
    filterParams: { ...filter },
    ...sort,
    search,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<UserResponse | null>(
    null,
  );

  const tableHeader: {
    key: keyof UserResponse;
    label: string;
  }[] = useMemo(
    () => [
      {
        key: 'firstName',
        label: 'Name',
      },
      {
        key: 'email',
        label: 'Email',
      },
      {
        key: 'phoneNumber',
        label: 'Phone',
      },
      {
        key: 'state',
        label: 'State',
      },
    ],
    [],
  );

  const displayedPages = useMemo(() => {
    if (!operators?.totalPages) return [];
    if (page === 0)
      return [1, 2, 3].filter((value) => value <= operators.totalPages);
    if (page === operators?.totalPages)
      return [page - 2, page - 1, page].filter((value) => value > 0);
    return [page - 1, page, page + 1].filter(
      (value) => value > 0 && value <= operators.totalPages,
    );
  }, [page, operators]);

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Operators</h1>
        <div className="flex gap-2 mb-4 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search"
            className="w-[300px]"
          />
          <Select
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, state: value }))
            }
            value={filter?.state}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(UserStateToDetailsMap).map(
                  ([status, { label }]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setSelectedOperator(null);
              setIsDialogOpen(true);
            }}
            className="h-9"
          >
            Add Operator
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
                <TableHead className="w-[200px]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {operators?.data.map((operator, index) => (
                <OperatorTableRow
                  key={index}
                  operator={operator}
                  onEdit={() => {
                    setSelectedOperator(operator);
                    setIsDialogOpen(true);
                  }}
                  onOpenProfile={() => {
                    setSelectedOperator(operator);
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
                    setPage((p) => Math.min(operators?.totalPages || 0, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <OperatorProfileDialog
          isOpen={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
          operator={selectedOperator}
        />
        <OpearatorActionDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          operator={selectedOperator}
        />
      </main>
    </div>
  );
}
