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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { OperatorEditDialogForm } from './OperatorEditDialogForm';

type Operator = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  state: 'pending' | 'verified' | 'verified';
};

function makeOperators(count = 35) {
  const states: Operator['state'][] = ['pending', 'verified', 'verified'];
  return Array.from({ length: count }).map((_, i) => ({
    id: String(3000 + i),
    name: `Operator ${i + 1}`,
    email: `operator${i + 1}@example.com`,
    phone: `+1234567890${i}`,
    state: states[i % states.length],
  })) as Operator[];
}

export default function OperatorsPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'email' | 'phone' | 'state'>(
    'name',
  );
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterState, setFilterState] = useState<string>('');
  const [data, setData] = useState(() => makeOperators(35));
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
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone || '').toLowerCase().includes(search.toLowerCase()),
      );
    if (filterState) arr = arr.filter((c) => c.state === filterState);
    arr.sort((a, b) => {
      const vA = (a[sortKey] ?? '') as string;
      const vB = (b[sortKey] ?? '') as string;
      if (vA < vB) return sortDir === 'asc' ? -1 : 1;
      if (vA > vB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, search, filterState, sortKey, sortDir]);

  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Operator | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editOperator, setEditOperator] = useState<Operator | null>(null);

  function openProfile(c: Operator) {
    setSelected(c);
    setOpen(true);
  }

  function openEditDialog(operator?: Operator) {
    setEditOperator(operator || null);
    setEditDialogOpen(true);
  }

  function handleSaveOperator(values: {
    name: string;
    phone?: string;
    email: string;
    state: Operator['state'];
  }) {
    if (editOperator) {
      // Edit
      setData((prev) =>
        prev.map((c) => (c.id === editOperator.id ? { ...c, ...values } : c)),
      );
    } else {
      // Create
      const newId = String(3000 + data.length);
      setData((prev) => [{ id: newId, ...values }, ...prev]);
    }
    setEditDialogOpen(false);
  }

  function handleDeleteOperator(id: string) {
    if (!confirm('Delete operator?')) return;
    setData((prev) => prev.filter((c) => c.id !== id));
    setOpen(false);
  }

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
          <Select onValueChange={(v) => setFilterState(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => openEditDialog()} className="h-9">
            Add Operator
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
                  className="cursor-pointer"
                >
                  Name
                </TableHead>
                <TableHead
                  onClick={() => {
                    setSortKey('email');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer"
                >
                  Email
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
                    setSortKey('state');
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  }}
                  className="cursor-pointer w-[150px]"
                >
                  State
                </TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone || '-'}</TableCell>
                  <TableCell className="w-[150px] capitalize">
                    {c.state}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <Button size="sm" onClick={() => openProfile(c)}>
                      View
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
            <DialogTitle>Operator profile</DialogTitle>
            {selected ? (
              <div className="mt-2">
                <p>
                  <strong>ID:</strong> {selected.id}
                </p>
                <p>
                  <strong>Name:</strong> {selected.name}
                </p>
                <p>
                  <strong>Email:</strong> {selected.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selected.phone}
                </p>
                <p>
                  <strong>State:</strong> {selected.state}
                </p>
              </div>
            ) : (
              <p>No operator selected</p>
            )}
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => selected && handleDeleteOperator(selected.id)}
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
              {editOperator ? 'Edit Operator' : 'Add Operator'}
            </DialogTitle>
            <OperatorEditDialogForm
              defaultValues={editOperator || undefined}
              onSubmit={handleSaveOperator}
              onCancel={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
