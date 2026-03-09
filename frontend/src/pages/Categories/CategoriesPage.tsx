import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { PlusIcon, TagsIcon, ArrowUpDownIcon, Tag } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { CategoryCard } from './CategoryCard'
import { CategoryModal } from './CategoryModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { GET_CATEGORIES, GET_CATEGORY_STATS } from '@/lib/graphql/queries/Categories'
import { DELETE_CATEGORY } from '@/lib/graphql/mutations/Categories'
import { ICON_MAP, COLOR_CLASSES } from '@/lib/utils'
import type { Category, CategoryStats } from '@/types'

interface CategoriesData {
  categories: Category[]
}

interface StatsData {
  categoryStats: CategoryStats
}

export function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [confirmCategory, setConfirmCategory] = useState<Category | null>(null)

  const { data: categoriesData, loading } = useQuery<CategoriesData>(GET_CATEGORIES)
  const { data: statsData } = useQuery<StatsData>(GET_CATEGORY_STATS)

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES, GET_CATEGORY_STATS],
    onCompleted: () => setConfirmCategory(null),
  })

  const categories = categoriesData?.categories ?? []
  const stats = statsData?.categoryStats
  const mostUsed = stats?.mostUsedCategory

  const MostUsedIcon = mostUsed ? (ICON_MAP[mostUsed.icon] ?? Tag) : null
  const mostUsedColors = mostUsed ? (COLOR_CLASSES[mostUsed.color] ?? COLOR_CLASSES.blue) : null

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (confirmCategory) {
      deleteCategory({ variables: { id: confirmCategory.id } })
    }
  }

  const handleNewCategory = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Categorias</h1>
            <p className="text-sm text-gray-500 mt-1">Organize suas transações por categorias</p>
          </div>
          <button
            onClick={handleNewCategory}
            className="flex items-center justify-center gap-2 bg-brand-base text-white hover:bg-brand-dark px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <PlusIcon size={16} />
            Nova categoria
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <TagsIcon size={22} className="text-gray-500" />
              <span className="text-3xl font-bold text-gray-800">
                {stats?.totalCategories ?? 0}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-400 tracking-widest uppercase">
              Total de Categorias
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpDownIcon size={22} className="text-gray-500" />
              <span className="text-3xl font-bold text-gray-800">
                {stats?.totalTransactions ?? 0}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-400 tracking-widests uppercase">
              Total de Transações
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              {MostUsedIcon && mostUsedColors ? (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mostUsedColors.bg}`}>
                  <MostUsedIcon size={18} className={mostUsedColors.text} />
                </div>
              ) : (
                <TagsIcon size={22} className="text-gray-300" />
              )}
              <span className="text-3xl font-bold text-gray-800">
                {mostUsed?.name ?? '—'}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-400 tracking-widests uppercase">
              Categoria Mais Utilizada
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16 text-sm">Carregando categorias...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            Nenhuma categoria encontrada. Crie sua primeira categoria!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onEdit={() => handleEdit(cat)}
                onDelete={() => setConfirmCategory(cat)}
              />
            ))}
          </div>
        )}
      </div>

      <CategoryModal
        open={modalOpen}
        onOpenChange={open => {
          setModalOpen(open)
          if (!open) setEditingCategory(null)
        }}
        category={editingCategory}
      />

      <ConfirmDialog
        open={!!confirmCategory}
        title="Excluir categoria"
        description={
          confirmCategory && (
            <>
              Tem certeza que deseja excluir{' '}
              <span className="font-medium text-gray-700">"{confirmCategory.name}"</span>?
              {confirmCategory.transactionCount > 0 && (
                <>
                  {' '}Esta ação também excluirá{' '}
                  <span className="font-medium text-feedback-danger">
                    {confirmCategory.transactionCount}{' '}
                    {confirmCategory.transactionCount === 1 ? 'transação associada' : 'transações associadas'}
                  </span>.
                </>
              )}
            </>
          )
        }
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmCategory(null)}
        loading={deleting}
      />
    </Layout>
  )
}
