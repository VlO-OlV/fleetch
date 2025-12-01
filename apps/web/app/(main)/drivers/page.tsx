"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

type Driver = { id: string; name: string; vehicle: string }

function makeDrivers(count = 27) {
  return Array.from({ length: count }).map((_, i) => ({
    id: String(3000 + i),
    name: `Driver ${i + 1}`,
    vehicle: `Van ${i % 6}`,
  })) as Driver[]
}

export default function DriversPage() {
  const data = useMemo(() => makeDrivers(27), [])
  const [page, setPage] = useState(1)
  const pageSize = 10
  const pageCount = Math.ceil(data.length / pageSize)
  const pageItems = data.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="w-full bg-zinc-50">
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Drivers</h1>

        <div className="rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {pageItems.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.vehicle}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">⋯</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col gap-2">
                          <Link href={`/drivers/${d.id}`} className="text-sky-600">View</Link>
                          <a onClick={() => alert("Edit " + d.id)}>Edit</a>
                          <a onClick={() => confirm("Delete driver?") && alert("Deleted")}>Delete</a>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(pageCount, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
