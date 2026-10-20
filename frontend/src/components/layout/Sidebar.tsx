import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, CheckSquare, Calendar, BarChart3,
  Brain, MessageSquare, Bell, Settings, User, Crown, LogOut,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Sparkles, label: 'AI Planner', path: '/planner' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Brain, label: 'Focus', path: '/focus' },
  { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: User, label: 'Profile', path: '/profile' },
]

const adminItems = [
  { icon: Crown, label: 'Admin', path: '/admin' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { logout, user } = useAuthStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold">SmartStudy</span>
          </Link>
        )}
        {collapsed && <Sparkles className="h-6 w-6 text-primary mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}

        {user?.role === 'admin' && (
          <>
            {!collapsed && <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Admin</div>}
            {adminItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
