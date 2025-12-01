import Link from "next/link"

export default function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-6">
        <Link href="/orders" className="text-sky-600">
          ← Back to orders
        </Link>
        <h1 className="text-2xl font-semibold mt-4">Order {id}</h1>
        <div className="mt-4 rounded-md bg-white p-4 shadow">
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Customer:</strong> Sample Client</p>
          <p><strong>Status:</strong> in transit</p>
          <p><strong>Amount:</strong> $123.45</p>
        </div>
      </div>
    </div>
  )
}
