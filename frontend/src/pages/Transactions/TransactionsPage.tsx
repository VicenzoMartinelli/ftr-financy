import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { PlusIcon, CircleMinusIcon, CirclePlusIcon, Tag, Trash2Icon, PencilIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { TransactionModal } from '@/components/TransactionModal'
import { GET_TRANSACTIONS } from '@/lib/graphql/queries/Transactions'
import { GET_CATEGORIES } from '@/lib/graphql/queries/Categories'
import { DELETE_TRANSACTION } from '@/lib/graphql/mutations/Transactions'
import { ICON_MAP, COLOR_CLASSES, formatCurrency, formatDate, generatePeriods } from '@/lib/utils'
import type { Category, Transaction, TransactionPage } from '@/types'

interface TransactionsData {
  transactions: TransactionPage
}

interface CategoriesData {
  categories: Category[]
}

const PERIODS = generatePeriods(24)

function getPeriodKey(p: { month: number; year: number }) {
  return `${p.year}-${p.month}`
}

export function TransactionsPage() {
  const defaultPeriod = PERIODS[0]

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [period, setPeriod] = useState(defaultPeriod)
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const limit = 10

  const { data, loading } = useQuery<TransactionsData>(GET_TRANSACTIONS, {
    variables: {
      search: search || undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
      month: period.month,
      year: period.year,
      page,
      limit,
    },
  })

  const { data: categoriesData } = useQuery<CategoriesData>(GET_CATEGORIES)
  const categories = categoriesData?.categories ?? []

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  })

  const txPage = data?.transactions
  const transactions = txPage?.transactions ?? []
  const total = txPage?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteTransaction({ variables: { id } })
  }

  const handleNewTransaction = () => {
    setEditingTransaction(null)
    setModalOpen(true)
  }

  const handleFilterChange = (cb: () => void) => {
    cb()
    setPage(1)
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Transações</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie todas as suas transações financeiras</p>
          </div>
          <button
            onClick={handleNewTransaction}
            className="flex items-center justify-center gap-2 bg-brand-base text-white hover:bg-brand-dark px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <PlusIcon size={16} />
            Nova transação
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Buscar</label>
              <div className="relative">
                <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => handleFilterChange(() => setSearch(e.target.value))}
                  placeholder="Buscar por descrição"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={typeFilter}
                onChange={e => handleFilterChange(() => setTypeFilter(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none bg-white"
              >
                <option value="all">Todos</option>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Categoria</label>
              <select
                value={categoryFilter}
                onChange={e => handleFilterChange(() => setCategoryFilter(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none bg-white"
              >
                <option value="all">Todas</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Período</label>
              <select
                value={getPeriodKey(period)}
                onChange={e => {
                  const found = PERIODS.find(p => getPeriodKey(p) === e.target.value)
                  if (found) handleFilterChange(() => setPeriod(found))
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none bg-white"
              >
                {PERIODS.map(p => (
                  <option key={getPeriodKey(p)} value={getPeriodKey(p)}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-400 tracking-widest uppercase px-5 py-3.5">Descrição</th>
                  <th className="text-left text-xs font-medium text-gray-400 tracking-widest uppercase px-4 py-3.5">Data</th>
                  <th className="text-left text-xs font-medium text-gray-400 tracking-widest uppercase px-4 py-3.5">Categoria</th>
                  <th className="text-left text-xs font-medium text-gray-400 tracking-widest uppercase px-4 py-3.5">Tipo</th>
                  <th className="text-right text-xs font-medium text-gray-400 tracking-widest uppercase px-4 py-3.5">Valor</th>
                  <th className="text-right text-xs font-medium text-gray-400 tracking-widests uppercase px-5 py-3.5">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-16 text-sm">
                      Carregando transações...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-16 text-sm">
                      Nenhuma transação encontrada.
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => {
                    const IconComp = ICON_MAP[tx.category.icon] ?? Tag
                    const colors = COLOR_CLASSES[tx.category.color] ?? COLOR_CLASSES.blue
                    const isIncome = tx.type === 'income'

                    return (
                      <tr key={tx.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
                              <IconComp size={17} className={colors.text} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[160px] sm:max-w-none">
                              {tx.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(tx.date)}
                        </td>

                        <td className="px-4 py-4">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${colors.bg} ${colors.text}`}>
                            {tx.category.name}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${isIncome ? 'text-feedback-success' : 'text-feedback-danger'}`}>
                            {isIncome
                              ? <CirclePlusIcon size={15} />
                              : <CircleMinusIcon size={15} />
                            }
                            {isIncome ? 'Entrada' : 'Saída'}
                          </div>
                        </td>

                        <td className={`px-4 py-4 text-sm font-semibold text-right whitespace-nowrap ${isIncome ? 'text-feedback-success' : 'text-feedback-danger'}`}>
                          {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="p-1.5 text-gray-400 hover:text-feedback-danger hover:bg-red-light rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2Icon size={15} />
                            </button>
                            <button
                              onClick={() => handleEdit(tx)}
                              className="p-1.5 text-gray-400 hover:text-brand-base hover:bg-green-light rounded-lg transition-colors"
                              title="Editar"
                            >
                              <PencilIcon size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {(page - 1) * limit + 1} a {Math.min(page * limit, total)} | {total} resultados
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === 'ellipsis' ? (
                      <span key={`e-${idx}`} className="w-8 text-center text-sm text-gray-400">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          page === item
                            ? 'bg-brand-base text-white'
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TransactionModal
        open={modalOpen}
        onOpenChange={open => {
          setModalOpen(open)
          if (!open) setEditingTransaction(null)
        }}
        transaction={editingTransaction}
      />
    </Layout>
  )
}
