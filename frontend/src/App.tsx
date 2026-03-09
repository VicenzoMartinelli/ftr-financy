import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { ProfilePage } from '@/pages/Auth/ProfilePage'
import { CategoriesPage } from '@/pages/Categories/CategoriesPage'
import { TransactionsPage } from '@/pages/Transactions/TransactionsPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { authStore } from '@/stores/auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authStore.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
