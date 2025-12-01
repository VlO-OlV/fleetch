"use client"

import { useMemo, useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"

type Client = { id: string; name: string; email: string }

function makeClients(count = 35) {
  return Array.from({ length: count }).map((_, i) => ({
    id: String(2000 + i),
    name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
  })) as Client[]
}

export default function ClientsPage() {
  const data = useMemo(() => makeClients(35), [])
  const [page, setPage] = useState(1)
  const pageSize = 10
  const pageCount = Math.ceil(data.length / pageSize)
  const items = data.slice((page - 1) * pageSize, page * pageSize)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)

  function openProfile(c: Client) {
    setSelected(c)
    setOpen(true)
  }

  return (
    <div className="w-full bg-zinc-50">
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Clients</h1>

        <div className="rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => openProfile(c)}>
                      Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              {Array.from({ length: pageCount }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(pageCount, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Client profile</DialogTitle>
            <DialogDescription>
              {selected ? (
                <div className="mt-2">
                  <p><strong>ID:</strong> {selected.id}</p>
                  <p><strong>Name:</strong> {selected.name}</p>
                  <p><strong>Email:</strong> {selected.email}</p>
                </div>
              ) : (
                <p>No client selected</p>
              )}
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
