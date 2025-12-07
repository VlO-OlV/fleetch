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
import { ClientEditDialogForm } from './ClientEditDialogForm';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

type Client = {
  id: string;
  totalRides: number;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  createdAt: string;
};

function makeClients(count = 35) {
  return Array.from({ length: count }).map((_, i) => ({
    id: String(2000 + i),
    name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    createdAt: new Date().toISOString(),
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    middleName: '',
    phone: `+1234567890${i}`,
    totalRides: 10 + i,
  })) as Client[];
}

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<
    'totalRides' | 'name' | 'email' | 'phone'
  >('totalRides');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [data, setData] = useState(() => makeClients(35));
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(data.length / pageSize);

  // Search, filter, sort
  const filtered = useMemo(() => {
    let arr = [...data];
    if (search)
      arr = arr.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()),
      );
    if (filter) arr = arr.filter((c) => c.email.includes(filter));
    arr.sort((a, b) => {
      const vA = a[sortKey] ?? '';
      const vB = b[sortKey] ?? '';
      if (vA < vB) return sortDir === 'asc' ? -1 : 1;
      if (vA > vB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, search, filter, sortKey, sortDir]);

  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  function openProfile(c: Client) {
    setSelected(c);
    setOpen(true);
  }

  function openEditDialog(client?: Client) {
    setEditClient(client || null);
    setEditDialogOpen(true);
  }

  function handleSaveClient(values: {
    firstName: string;
    lastName: string;
    phone: string;
    middleName?: string | undefined;
  }) {
    if (editClient) {
      // Edit
      setData((prev) =>
        prev.map((c) =>
          c.id === editClient.id
            ? {
                ...c,
                ...values,
                name: `${values.firstName} ${values.lastName}`,
              }
            : c,
        ),
      );
    } else {
      // Create
      const newId = String(2000 + data.length);
      setData((prev) => [
        {
          id: newId,
          totalRides: 35,
          name: `${values.firstName} ${values.lastName}`,
          email: `${values.firstName.toLowerCase()}${values.lastName.toLowerCase()}@example.com`,
          createdAt: new Date().toISOString(),
          ...values,
        },
        ...prev,
      ]);
    }
    setEditDialogOpen(false);
  }

  function handleDeleteClient(id: string) {
    if (!confirm('Delete client?')) return;
    setData((prev) => prev.filter((c) => c.id !== id));
    setOpen(false);
  }

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
          <Button onClick={() => openEditDialog()} className="h-9">
            Add Client
          </Button>
        </div>
        <div className="rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <tr>
                <TableHead
                  onClick={() => {
                    setSortKey('name');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  Name{' '}
                  {sortDir === 'asc' ? (
                    <ChevronUpIcon size={18} />
                  ) : (
                    <ChevronDownIcon size={18} />
                  )}
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
                <TableHead onClick={() => {}} className="cursor-pointer">
                  Date
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('totalRides');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer w-[150px]"
                >
                  Total rides
                </TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone || '-'}</TableCell>
                  <TableCell>
                    {format(new Date(c.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="w-[150px]">{c.totalRides}</TableCell>
                  <TableCell className="w-[150px]">
                    <Button size="sm" onClick={() => openProfile(c)}>
                      Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(c)}
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Client profile</DialogTitle>
            {selected ? (
              <div className="mt-2">
                <p>
                  <strong>ID:</strong> {selected.id}
                </p>
                <p>
                  <strong>Name:</strong> {selected.name}
                </p>
                <p>
                  <strong>First Name:</strong> {selected.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {selected.lastName}
                </p>
                <p>
                  <strong>Middle Name:</strong> {selected.middleName}
                </p>
                <p>
                  <strong>Phone:</strong> {selected.phone}
                </p>
              </div>
            ) : (
              <p>No client selected</p>
            )}
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => selected && handleDeleteClient(selected.id)}
              >
                Delete
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogTitle>
              {editClient ? 'Edit Client' : 'Add Client'}
            </DialogTitle>
            <ClientEditDialogForm
              defaultValues={editClient || undefined}
              onSubmit={handleSaveClient}
              onCancel={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
