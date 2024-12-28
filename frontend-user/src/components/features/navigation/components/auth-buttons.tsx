import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AuthButtons() {
  return (
    <nav className="flex items-center gap-2">
      <Button variant="ghost" className="hidden md:inline-flex" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/create-account">Sign up</Link>
      </Button>
    </nav>
  );
}