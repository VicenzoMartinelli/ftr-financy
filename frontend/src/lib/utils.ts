import type { LucideIcon } from 'lucide-react'
import {
  Tag,
  Utensils,
  Gift,
  TrendingUp,
  ShoppingCart,
  Briefcase,
  Heart,
  Bus,
  Zap,
  Coffee,
  Home,
  Car,
  Music,
  Book,
  DollarSign,
  CreditCard,
  Wallet,
  Plane,
  Dumbbell,
  Shirt,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  tag: Tag,
  utensils: Utensils,
  gift: Gift,
  'trending-up': TrendingUp,
  'shopping-cart': ShoppingCart,
  briefcase: Briefcase,
  heart: Heart,
  bus: Bus,
  zap: Zap,
  coffee: Coffee,
  home: Home,
  car: Car,
  music: Music,
  book: Book,
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  wallet: Wallet,
  plane: Plane,
  dumbbell: Dumbbell,
  shirt: Shirt,
}

export const ICON_OPTIONS = Object.keys(ICON_MAP)

export const COLOR_CLASSES: Record<string, { bg: string; text: string }> = {
  blue:   { bg: 'bg-blue-light',   text: 'text-blue-dark' },
  purple: { bg: 'bg-purple-light', text: 'text-purple-dark' },
  pink:   { bg: 'bg-pink-light',   text: 'text-pink-dark' },
  green:  { bg: 'bg-green-light',  text: 'text-green-dark' },
  orange: { bg: 'bg-orange-light', text: 'text-orange-dark' },
  red:    { bg: 'bg-red-light',    text: 'text-red-dark' },
  yellow: { bg: 'bg-yellow-light', text: 'text-yellow-dark' },
}

export const COLOR_OPTIONS = ['green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow']

export const COLOR_HEX: Record<string, string> = {
  blue:   '#2563EB',
  purple: '#9333EA',
  pink:   '#DB2777',
  green:  '#16A34A',
  orange: '#EA580C',
  red:    '#DC2626',
  yellow: '#CA8A04',
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function formatCurrency(amount: number): string {
  return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(isoString: string): string {
  const [datePart] = isoString.split('T')
  const [year, month, day] = datePart.split('-')
  return `${day}/${month}/${year.slice(2)}`
}

const PT_MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export interface Period {
  label: string
  month: number
  year: number
}

export function generatePeriods(count = 24): Period[] {
  const now = new Date()
  const periods: Period[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    periods.push({
      label: `${PT_MONTHS[d.getMonth()]} / ${d.getFullYear()}`,
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    })
  }
  return periods
}
