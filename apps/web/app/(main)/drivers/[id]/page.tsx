import Link from "next/link"

export default function DriverPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-6">
        <Link href="/drivers" className="text-sky-600">← Back to drivers</Link>
        <h1 className="text-2xl font-semibold mt-4">Driver {id}</h1>
        <div className="mt-4 rounded-md bg-white p-4 shadow">
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Name:</strong> Sample Driver</p>
          <p><strong>Vehicle:</strong> Van 3</p>
          <p><strong>Status:</strong> active</p>
        </div>
      </div>
    </div>
  )
}
