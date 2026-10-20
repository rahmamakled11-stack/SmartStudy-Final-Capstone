import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore, useNotificationStore } from '@/store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function TopBar() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationStore()

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-accent/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <Link to="/profile" className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.subscription} Plan</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
