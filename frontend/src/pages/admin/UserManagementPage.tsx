import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import apiClient from '@/lib/api'

export function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/admin/users')
      setUsers(res.data.users || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const updateRole = async (id: string, role: string) => {
    await apiClient.put(`/admin/users/${id}/role`, { role })
    fetchUsers()
  }

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform users</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="glass-card-strong">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Crown className="h-3 w-3 text-yellow-500" />
                          <span className="capitalize text-sm">{user.subscriptionPlan || 'free'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {user.role !== 'admin' ? (
                            <Button size="sm" variant="outline" onClick={() => updateRole(user.id || user._id, 'admin')}>
                              <Shield className="mr-1 h-3 w-3" />
                              Make Admin
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => updateRole(user.id || user._id, 'user')}>
                              Remove Admin
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
