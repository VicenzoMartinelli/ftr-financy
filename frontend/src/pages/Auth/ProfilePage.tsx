import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { MailIcon, UserIcon, LogOutIcon } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { GET_ME } from '@/lib/graphql/queries/Auth'
import { UPDATE_USER } from '@/lib/graphql/mutations/Auth'
import { getInitials } from '@/lib/utils'
import { authStore } from '@/stores/auth'
import type { User } from '@/types'

interface MeData {
  me: User
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { data } = useQuery<MeData>(GET_ME)
  const user = data?.me

  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_ME],
    onCompleted: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    updateUser({ variables: { name } })
  }

  const handleLogout = () => {
    authStore.clearToken()
    navigate('/login')
  }

  const initials = user ? getInitials(user.name) : '?'

  return (
    <Layout>
      <div className="flex items-start justify-center pt-6 sm:pt-12 px-4 pb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 w-full max-w-sm shadow-sm">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">{initials}</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">{user?.name ?? '—'}</p>
              <p className="text-sm text-gray-500">{user?.email ?? '—'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nome completo</label>
              <div className="relative">
                <UserIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <MailIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-500 bg-gray-50 cursor-not-allowed outline-none"
                />
              </div>
              <span className="text-xs text-gray-400">O e-mail não pode ser alterado</span>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-brand-base text-white hover:bg-brand-dark py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saved ? 'Salvo!' : loading ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOutIcon size={15} />
              Sair da conta
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
