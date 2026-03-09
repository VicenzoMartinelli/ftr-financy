import { useState, useEffect } from 'react'
import { XIcon, CircleMinusIcon, CirclePlusIcon } from 'lucide-react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/lib/graphql/mutations/Transactions'
import { GET_CATEGORIES } from '@/lib/graphql/queries/Categories'
import type { Category, Transaction } from '@/types'

interface CategoriesData {
  categories: Category[]
}

interface TransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function TransactionModal({ open, onOpenChange, transaction }: TransactionModalProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO())
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const client = useApolloClient()
  const { data: categoriesData } = useQuery<CategoriesData>(GET_CATEGORIES)
  const categories = categoriesData?.categories ?? []

  useEffect(() => {
    if (open) {
      if (transaction) {
        setType(transaction.type === 'income' ? 'income' : 'expense')
        setTitle(transaction.title)
        setDate(transaction.date.split('T')[0])
        setAmount(String(transaction.amount))
        setCategoryId(transaction.category.id)
      } else {
        setType('expense')
        setTitle('')
        setDate(todayISO())
        setAmount('')
        setCategoryId('')
      }
    }
  }, [open, transaction])

  const onCompleted = () => {
    client.refetchQueries({ include: 'active' })
    onOpenChange(false)
  }

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    onCompleted,
  })

  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    onCompleted,
  })

  const loading = creating || updating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!title.trim() || !categoryId || isNaN(parsedAmount) || parsedAmount <= 0) return

    if (transaction) {
      updateTransaction({
        variables: { id: transaction.id, title, amount: parsedAmount, type, categoryId, date },
      })
    } else {
      createTransaction({
        variables: { title, amount: parsedAmount, type, categoryId, date },
      })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />

      <div className="relative bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              {transaction ? 'Editar transação' : 'Nova transação'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Registre sua despesa ou receita</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors -mt-0.5"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'border-feedback-danger text-feedback-danger bg-red-light'
                  : 'border-gray-300 text-gray-400 hover:border-gray-400'
              }`}
            >
              <CircleMinusIcon size={15} />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                type === 'income'
                  ? 'border-feedback-success text-feedback-success bg-green-light'
                  : 'border-gray-300 text-gray-400 hover:border-gray-400'
              }`}
            >
              <CirclePlusIcon size={15} />
              Receita
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex. Almoço no restaurante"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0,00"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none bg-white"
            >
              <option value="" disabled>Selecione</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || !categoryId || !amount}
            className="w-full bg-brand-base text-white hover:bg-brand-dark py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  )
}
