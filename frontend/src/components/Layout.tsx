import { Header } from '@/components/Header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main>{children}</main>
    </div>
  )
}
