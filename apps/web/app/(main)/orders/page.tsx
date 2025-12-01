"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

type Order = {
  id: string
  customer: string
  status: string
  amount: string
}

function makeOrders(count = 50) {
  return Array.from({ length: count }).map((_, i) => ({
    id: String(1000 + i),
    customer: `Client ${i + 1}`,
    status: i % 3 === 0 ? "delivered" : i % 3 === 1 ? "in transit" : "pending",
    amount: `$${(Math.random() * 200).toFixed(2)}`,
  })) as Order[]
}

export default function OrdersPage() {
  const data = useMemo(() => makeOrders(53), [])
  const [page, setPage] = useState(1)
  const pageSize = 10

  const pageCount = Math.ceil(data.length / pageSize)
  const pageItems = data.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="w-full bg-zinc-50">
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        <div className="rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {pageItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <Button size="icon" variant="ghost">⋯</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col gap-2">
                          <Link href={`/orders/${row.id}`} className="text-sky-600">
                            View
                          </Link>
                          <a onClick={() => alert("Edit " + row.id)}>Edit</a>
                          <a onClick={() => confirm("Delete order?") && alert("Deleted")}>Delete</a>
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
                <PaginationNext onClick={() => setPage((p) => Math.min(pageCount, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
