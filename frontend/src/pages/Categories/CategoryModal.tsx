import { useState, useEffect } from 'react'
import { XIcon, Tag } from 'lucide-react'
import { useMutation } from '@apollo/client'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/lib/graphql/mutations/Categories'
import { GET_CATEGORIES, GET_CATEGORY_STATS } from '@/lib/graphql/queries/Categories'
import { ICON_MAP, ICON_OPTIONS, COLOR_OPTIONS, COLOR_HEX } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
}

export function CategoryModal({ open, onOpenChange, category }: CategoryModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('briefcase')
  const [color, setColor] = useState('green')

  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name)
        setDescription(category.description ?? '')
        setIcon(category.icon)
        setColor(category.color)
      } else {
        setName('')
        setDescription('')
        setIcon('briefcase')
        setColor('green')
      }
    }
  }, [category, open])

  const refetchQueries = [GET_CATEGORIES, GET_CATEGORY_STATS]

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries,
    onCompleted: () => onOpenChange(false),
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries,
    onCompleted: () => onOpenChange(false),
  })

  const loading = creating || updating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (category) {
      updateCategory({ variables: { id: category.id, name, description, icon, color } })
    } else {
      createCategory({ variables: { name, description, icon, color } })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />

      <div className="relative bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              {category ? 'Editar categoria' : 'Nova categoria'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Organize suas transações com categorias
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors -mt-0.5"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex. Alimentação"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descrição da categoria"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-base focus:ring-1 focus:ring-brand-base outline-none"
            />
            <span className="text-xs text-gray-400">Opcional</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Ícone</label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
              {ICON_OPTIONS.map(iconKey => {
                const IconComp = ICON_MAP[iconKey] ?? Tag
                const isSelected = icon === iconKey
                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setIcon(iconKey)}
                    className={`h-10 flex items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-brand-base bg-green-light text-brand-base'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComp size={17} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c
                      ? 'scale-110 ring-2 ring-offset-2 ring-gray-400'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: COLOR_HEX[c] }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-brand-base text-white hover:bg-brand-dark py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  )
}
