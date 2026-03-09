import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, UserPlusIcon } from 'lucide-react'
import { LOGIN, REGISTER } from '@/lib/graphql/mutations/Auth'
import { authStore } from '@/stores/auth'

type Mode = 'login' | 'register'

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'E-mail ou senha incorretos.',
  'Email already in use': 'Este e-mail já está em uso.',
}

function parseError(message: string): string {
  return ERROR_MESSAGES[message] ?? 'Ocorreu um erro inesperado. Tente novamente.'
}

export function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState<'credentials' | 'email' | null>(null)

  const [login, { loading: loggingIn }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      authStore.setToken(data.login.token)
      navigate('/dashboard')
    },
    onError: (err) => {
      setError(parseError(err.message))
      setErrorField('credentials')
    },
  })

  const [register, { loading: registering }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      authStore.setToken(data.register.token)
      navigate('/dashboard')
    },
    onError: (err) => {
      setError(parseError(err.message))
      setErrorField(err.message === 'Email already in use' ? 'email' : 'credentials')
    },
  })

  const loading = loggingIn || registering

  if (authStore.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const clearError = () => {
    setError('')
    setErrorField(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (mode === 'login') {
      login({ variables: { email, password } })
    } else {
      register({ variables: { name, email, password } })
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    clearError()
    setName('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
  }

  const emailError = errorField === 'credentials' || errorField === 'email'
  const passwordError = errorField === 'credentials'

  const inputBase = 'w-full border rounded-lg py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors'
  const inputNormal = 'border-gray-300 focus:border-brand-base focus:ring-1 focus:ring-brand-base'
  const inputErr = 'border-feedback-danger focus:border-feedback-danger focus:ring-1 focus:ring-feedback-danger bg-red-light/30'

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans px-4">
      <img src="/logo.png" alt="Financy" className="h-10 mb-8" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {mode === 'login' ? 'Fazer login' : 'Criar conta'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login'
              ? 'Entre na sua conta para continuar'
              : 'Crie sua conta para começar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nome completo</label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className={`${inputBase} ${inputNormal} pl-9 pr-3`}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${emailError ? 'text-feedback-danger' : 'text-gray-700'}`}>
              E-mail
            </label>
            <div className="relative">
              <MailIcon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${emailError ? 'text-feedback-danger' : 'text-gray-400'}`} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError() }}
                placeholder="mail@exemplo.com"
                required
                className={`${inputBase} ${emailError ? inputErr : inputNormal} pl-9 pr-3`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${passwordError ? 'text-feedback-danger' : 'text-gray-700'}`}>
              Senha
            </label>
            <div className="relative">
              <LockIcon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${passwordError ? 'text-feedback-danger' : 'text-gray-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); clearError() }}
                placeholder="Digite sua senha"
                required
                className={`${inputBase} ${passwordError ? inputErr : inputNormal} pl-9 pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded"
                  style={{ accentColor: '#1F6F43' }}
                />
                Lembrar-me
              </label>
              <button
                type="button"
                className="text-sm text-brand-base hover:text-brand-dark transition-colors"
              >
                Recuperar senha
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-feedback-danger bg-red-light px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-base text-white hover:bg-brand-dark py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === 'login' ? 'Entrando...' : 'Criando conta...'
              : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-sm text-gray-500 text-center">
            {mode === 'login'
              ? 'Ainda não tem uma conta?'
              : 'Já tem uma conta?'}
          </p>

          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {mode === 'login' ? (
              <>
                <UserPlusIcon size={15} />
                Criar conta
              </>
            ) : (
              'Fazer login'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
