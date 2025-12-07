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

type Order = {
  id: string;
  clientName: string;
  driverName: string;
  operatorName: string;
  status: 'Completed' | 'In progress' | 'Pending' | 'Cancelled';
  paymentType: 'Cash' | 'Card' | 'Crypto';
  totalPrice: number;
  rideClass: 'Economy' | 'Business' | 'Vip';
};

function makeOrders(count = 50) {
  const statuses: Order['status'][] = [
    'Completed',
    'In progress',
    'Pending',
    'Cancelled',
  ];
  const payments: Order['paymentType'][] = ['Cash', 'Card', 'Crypto'];
  const classes: Order['rideClass'][] = ['Economy', 'Business', 'Vip'];
  return Array.from({ length: count }).map((_, i) => ({
    id: String(1000 + i),
    clientName: `Client ${i + 1}`,
    driverName: `Driver ${(i % 27) + 1}`,
    operatorName: `Operator ${(i % 5) + 1}`,
    status: statuses[i % statuses.length],
    paymentType: payments[i % payments.length],
    totalPrice: Number(200.45),
    rideClass: classes[i % classes.length],
  })) as Order[];
}

export default function OrdersPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<
    | 'id'
    | 'clientName'
    | 'driverName'
    | 'operatorName'
    | 'status'
    | 'paymentType'
    | 'totalPrice'
    | 'rideClass'
  >('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [rideClassFilter, setRideClassFilter] = useState('');
  const [data] = useState(() => makeOrders(53));
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(data.length / pageSize);

  // Search, filter, sort
  const filtered = useMemo(() => {
    let arr = [...data];
    if (search)
      arr = arr.filter(
        (o) =>
          o.clientName.toLowerCase().includes(search.toLowerCase()) ||
          o.driverName.toLowerCase().includes(search.toLowerCase()) ||
          o.operatorName.toLowerCase().includes(search.toLowerCase()) ||
          o.status.toLowerCase().includes(search.toLowerCase()),
      );
    if (statusFilter) arr = arr.filter((o) => o.status === statusFilter);
    if (paymentFilter) arr = arr.filter((o) => o.paymentType === paymentFilter);
    if (rideClassFilter)
      arr = arr.filter((o) => o.rideClass === rideClassFilter);
    arr.sort((a, b) => {
      const vA = a[sortKey] ?? '';
      const vB = b[sortKey] ?? '';
      if (typeof vA === 'number' && typeof vB === 'number') {
        return sortDir === 'asc' ? vA - vB : vB - vA;
      }
      if (vA < vB) return sortDir === 'asc' ? -1 : 1;
      if (vA > vB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [
    data,
    search,
    statusFilter,
    paymentFilter,
    rideClassFilter,
    sortKey,
    sortDir,
  ]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

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
            onValueChange={(v) => setStatusFilter(v)}
            value={statusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(new Set(data.map((o) => o.status))).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setPaymentFilter(v)}
            value={paymentFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(new Set(data.map((o) => o.paymentType))).map(
                  (p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setRideClassFilter(v)}
            value={rideClassFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(new Set(data.map((o) => o.rideClass))).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
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
                <TableHead
                  onClick={() => {
                    setSortKey('clientName');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Client
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('driverName');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Driver
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('operatorName');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Operator
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('status');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Status
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('paymentType');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Payment
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('totalPrice');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Total Price
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('rideClass');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Ride Class
                </TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {pageItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.clientName}</TableCell>
                  <TableCell>{row.driverName}</TableCell>
                  <TableCell>{row.operatorName}</TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={
                        row.status === 'Completed'
                          ? 'success'
                          : row.status === 'Cancelled'
                            ? 'danger'
                            : 'info'
                      }
                    >
                      {row.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={
                        row.paymentType === 'Cash'
                          ? 'neutral'
                          : row.paymentType === 'Card'
                            ? 'info'
                            : 'success'
                      }
                    >
                      {row.paymentType}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>${row.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{row.rideClass}</TableCell>
                  <TableCell className="w-[150px]">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/orders/${row.id}`)}
                    >
                      Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/orders/${row.id}/edit`)}
                      className="ml-2"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
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
              {Array.from({ length: pageCount }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
}
