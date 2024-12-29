import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center lg:ml-0 -ml-4">
      <div className="bg-black text-white px-2 py-1 text-xl font-bold">Log</div>
    </Link>
  )
}
