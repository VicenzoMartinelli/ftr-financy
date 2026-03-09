import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import {
  WalletIcon,
  CirclePlusIcon,
  CircleMinusIcon,
  PlusIcon,
  ChevronRightIcon,
  Tag,
} from 'lucide-react'
import { Layout } from '@/components/Layout'
import { TransactionModal } from '@/components/TransactionModal'
import { GET_DASHBOARD } from '@/lib/graphql/queries/Dashboard'
import { ICON_MAP, COLOR_CLASSES, formatCurrency, formatDate } from '@/lib/utils'
import type { Category, Transaction } from '@/types'

interface CategoryBreakdown {
  category: Category
  count: number
  total: number
}

interface DashboardData {
  dashboard: {
    balance: number
    monthlyIncome: number
    monthlyExpenses: number
    recentTransactions: Transaction[]
    categoryBreakdown: CategoryBreakdown[]
  }
}

export function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data, loading } = useQuery<DashboardData>(GET_DASHBOARD)
  const dash = data?.dashboard

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <WalletIcon size={18} className="text-purple-500" />
              <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                Saldo Total
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '—' : formatCurrency(dash?.balance ?? 0)}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CirclePlusIcon size={18} className="text-feedback-success" />
              <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                Receitas do Mês
              </span>
            </div>
            <p className="text-3xl font-bold text-feedback-success">
              {loading ? '—' : formatCurrency(dash?.monthlyIncome ?? 0)}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CircleMinusIcon size={18} className="text-feedback-danger" />
              <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                Despesas do Mês
              </span>
            </div>
            <p className="text-3xl font-bold text-feedback-danger">
              {loading ? '—' : formatCurrency(dash?.monthlyExpenses ?? 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                Transações Recentes
              </span>
              <Link
                to="/transactions"
                className="flex items-center gap-1 text-sm font-medium text-brand-base hover:text-brand-dark transition-colors"
              >
                Ver todas
                <ChevronRightIcon size={15} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <p className="text-center text-sm text-gray-400 py-12">Carregando...</p>
              ) : !dash?.recentTransactions.length ? (
                <p className="text-center text-sm text-gray-400 py-12">
                  Nenhuma transação ainda.
                </p>
              ) : (
                dash.recentTransactions.map(tx => {
                  const IconComp = ICON_MAP[tx.category.icon] ?? Tag
                  const colors = COLOR_CLASSES[tx.category.color] ?? COLOR_CLASSES.blue
                  const isIncome = tx.type === 'income'

                  return (
                    <div key={tx.id} className="flex items-center gap-4 px-5 py-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
                        <IconComp size={18} className={colors.text} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{tx.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.date)}</p>
                      </div>

                      <span className={`hidden sm:inline text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${colors.bg} ${colors.text}`}>
                        {tx.category.name}
                      </span>

                      <div className={`flex items-center gap-1.5 shrink-0 text-sm font-semibold ${isIncome ? 'text-feedback-success' : 'text-feedback-danger'}`}>
                        <span>{isIncome ? '+' : '-'} {formatCurrency(tx.amount)}</span>
                        {isIncome
                          ? <CirclePlusIcon size={16} />
                          : <CircleMinusIcon size={16} />
                        }
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="border-t border-gray-100 px-5 py-3.5">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-brand-base hover:text-brand-dark transition-colors py-1"
              >
                <PlusIcon size={15} />
                Nova transação
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                Categorias
              </span>
              <Link
                to="/categories"
                className="flex items-center gap-1 text-sm font-medium text-brand-base hover:text-brand-dark transition-colors"
              >
                Gerenciar
                <ChevronRightIcon size={15} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <p className="text-center text-sm text-gray-400 py-12">Carregando...</p>
              ) : !dash?.categoryBreakdown.length ? (
                <p className="text-center text-sm text-gray-400 py-12">
                  Nenhuma categoria com transações.
                </p>
              ) : (
                dash.categoryBreakdown.map(({ category, count, total }) => {
                  const colors = COLOR_CLASSES[category.color] ?? COLOR_CLASSES.blue
                  return (
                    <div key={category.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${colors.bg} ${colors.text}`}>
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">{count} {count === 1 ? 'item' : 'itens'}</span>
                      <span className="text-sm font-semibold text-gray-700 ml-auto whitespace-nowrap">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <TransactionModal open={modalOpen} onOpenChange={setModalOpen} />
    </Layout>
  )
}
