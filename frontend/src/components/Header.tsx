import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Link, useLocation } from 'react-router-dom'
import { MenuIcon, XIcon } from 'lucide-react'
import { GET_ME } from '@/lib/graphql/queries/Auth'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

interface MeData {
  me: User
}

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transações', to: '/transactions' },
  { label: 'Categorias', to: '/categories' },
]

export function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data } = useQuery<MeData>(GET_ME, { errorPolicy: 'ignore' })
  const user = data?.me

  return (
    <header className="bg-white border-b border-gray-200 relative z-40">
      <div className="px-4 sm:px-8 h-14 flex items-center gap-4">
        <div className="flex-1">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Financy" className="h-6 sm:h-7" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={
                location.pathname === link.to
                  ? 'text-brand-base font-semibold text-sm'
                  : 'text-gray-600 hover:text-gray-800 text-sm transition-colors'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex items-center justify-end gap-2">
          <button
            className="md:hidden p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          <Link
            to="/profile"
            title="Meu perfil"
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors shrink-0"
          >
            <span className="text-xs font-semibold text-gray-600">
              {user ? getInitials(user.name) : '?'}
            </span>
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-base font-semibold bg-green-light'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
