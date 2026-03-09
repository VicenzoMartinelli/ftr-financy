import { Trash2Icon, PencilIcon, Tag } from 'lucide-react'
import { ICON_MAP, COLOR_CLASSES } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  onEdit: () => void
  onDelete: () => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const colors = COLOR_CLASSES[category.color] ?? COLOR_CLASSES.blue
  const IconComponent = ICON_MAP[category.icon] ?? Tag

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg}`}>
          <IconComponent size={18} className={colors.text} />
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onDelete}
            className="text-gray-300 hover:text-feedback-danger hover:bg-red-light p-1.5 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2Icon size={15} />
          </button>
          <button
            onClick={onEdit}
            className="text-gray-300 hover:text-brand-base hover:bg-green-light p-1.5 rounded-lg transition-colors"
            title="Editar"
          >
            <PencilIcon size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
        {category.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{category.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
          {category.name}
        </span>
        <span className="text-xs text-gray-500">
          {category.transactionCount} {category.transactionCount === 1 ? 'item' : 'itens'}
        </span>
      </div>
    </div>
  )
}
