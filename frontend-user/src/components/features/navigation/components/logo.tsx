import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center lg:ml-0 -ml-4">
      <div className="text-black text-xl lg:text-3xl font-bold lg:font-extrabold transition-all duration-300">
        Miwara
      </div>
    </Link>
  )
}
