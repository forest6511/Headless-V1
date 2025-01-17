import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center lg:ml-0 -ml-4">
      <div className="bg-[#0D7FC0] text-white px-2 py-1 text-xl font-bold">
        Miwara
      </div>
    </Link>
  )
}
