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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DriverEditDialogForm } from './DriverEditDialogForm';

type Driver = {
  id: string;
  name: string;
  phone: string;
  rideClass: string;
  status: 'active' | 'inactive' | 'suspended';
  totalRides: number;
  carNumber: string;
  vehicle: string;
};

function makeDrivers(count = 27) {
  const classes = ['economy', 'business', 'vip'];
  const statuses: Driver['status'][] = ['active', 'inactive', 'suspended'];
  return Array.from({ length: count }).map((_, i) => ({
    id: String(3000 + i),
    name: `Driver ${i + 1}`,
    phone: `+1-555-01${String(i).padStart(2, '0')}`,
    rideClass: classes[i % classes.length],
    status: statuses[i % statuses.length],
    totalRides: 123,
    carNumber: `CAR-${3000 + i}`,
    vehicle: `Van ${i % 6}`,
  })) as Driver[];
}

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<
    | 'id'
    | 'name'
    | 'vehicle'
    | 'rideClass'
    | 'status'
    | 'totalRides'
    | 'carNumber'
    | 'phone'
  >('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rideClassFilter, setRideClassFilter] = useState('');
  const [data] = useState(() => makeDrivers(27));
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(data.length / pageSize);

  // Search, filter, sort
  const filtered = useMemo(() => {
    let arr = [...data];
    if (search)
      arr = arr.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.vehicle.toLowerCase().includes(search.toLowerCase()) ||
          d.phone.toLowerCase().includes(search.toLowerCase()) ||
          d.rideClass.toLowerCase().includes(search.toLowerCase()),
      );
    if (filter) arr = arr.filter((d) => d.vehicle === filter);
    if (statusFilter) arr = arr.filter((d) => d.status === statusFilter);
    if (rideClassFilter)
      arr = arr.filter((d) => d.rideClass === rideClassFilter);
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
  }, [data, search, filter, rideClassFilter, statusFilter, sortKey, sortDir]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  // Dialog state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);

  function openProfile(d: Driver) {
    setSelected(d);
    setOpen(true);
  }

  function openEditDialog(driver?: Driver) {
    setEditDriver(driver || null);
    setEditDialogOpen(true);
  }

  function handleSaveDriver(values: {
    name: string;
    phone?: string | undefined;
    rideClass?: string | undefined;
    carNumber?: string | undefined;
    status?: 'active' | 'inactive' | 'suspended' | undefined;
  }) {
    if (editDriver) {
      // Edit
      const updated = { ...editDriver, ...values };
      // update data array
      // as data is from useState(() => makeDrivers()) we need to replace it by creating a new state if we had setter; currently data is constant so simulate update by alert
      // In a real app, replace with API call and refresh
      console.log('Edited driver', updated);
    } else {
      console.log('Create driver', values);
    }
    setEditDialogOpen(false);
  }

  function handleDeleteDriver(id: string) {
    if (!confirm('Delete driver?')) return;
    // data is read-only in this mock; in a real app call API and refresh state
    alert('Deleted ' + id);
    setOpen(false);
  }

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Drivers</h1>
        <div className="flex gap-2 mb-4 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search"
            className="w-[300px]"
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
                {Array.from(new Set(data.map((d) => d.status))).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setRideClassFilter(v)}
            value={rideClassFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(new Set(data.map((d) => d.rideClass))).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button onClick={() => openEditDialog()} className="h-9">
            Add Driver
          </Button>
        </div>
        <div className="rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <tr>
                <TableHead
                  onClick={() => {
                    setSortKey('id');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  ID
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('name');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Name
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('phone');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Phone
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
                    setSortKey('totalRides');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Total Rides
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('carNumber');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Car #
                </TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {pageItems.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell className="capitalize">{d.rideClass}</TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={
                        d.status === 'active'
                          ? 'success'
                          : d.status === 'suspended'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {d.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{d.totalRides}</TableCell>
                  <TableCell>{d.carNumber}</TableCell>
                  <TableCell className="w-[150px]">
                    <Button size="sm" onClick={() => openProfile(d)}>
                      Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(d)}
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
        {/* Profile dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Driver profile</DialogTitle>
            {selected ? (
              <div className="mt-2">
                <p>
                  <strong>ID:</strong> {selected.id}
                </p>
                <p>
                  <strong>Name:</strong> {selected.name}
                </p>
                <p>
                  <strong>Phone:</strong> {selected.phone}
                </p>
                <p>
                  <strong>Ride Class:</strong> {selected.rideClass}
                </p>
                <p>
                  <strong>Car #:</strong> {selected.carNumber}
                </p>
                <p>
                  <strong>Total rides:</strong> {selected.totalRides}
                </p>
              </div>
            ) : (
              <p>No driver selected</p>
            )}
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => selected && handleDeleteDriver(selected.id)}
              >
                Delete
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogTitle>
              {editDriver ? 'Edit Driver' : 'Add Driver'}
            </DialogTitle>
            <DriverEditDialogForm
              defaultValues={editDriver || undefined}
              onSubmit={handleSaveDriver}
              onCancel={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
