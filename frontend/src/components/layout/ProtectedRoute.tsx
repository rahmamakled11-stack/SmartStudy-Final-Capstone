import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'

interface ProtectedRouteProps {
  requireAdmin?: boolean
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
