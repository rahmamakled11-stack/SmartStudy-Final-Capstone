import { Outlet, Link } from 'react-router-dom'
import { Brain } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Brain className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">SmartStudy</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
