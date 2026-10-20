import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Bell,
  User,
  CreditCard,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store'
import type { UserSettings, Theme, Language } from '@/types'

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  language: 'en',
  notifications: true,
  emailNotifications: true,
  pushNotifications: true,
  studyReminders: true,
  reminderTime: '09:00',
  soundEffects: true,
  autoSave: true,
}

export function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [settings, setSettings] = useState<UserSettings>({
    ...DEFAULT_SETTINGS,
    ...user?.settings,
  })

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated: UserSettings = { ...settings, [key]: value }
    setSettings(updated)
    updateUser({ settings: updated })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and account settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Palette className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light' as Theme, icon: Sun, label: 'Light' },
                    { value: 'dark' as Theme, icon: Moon, label: 'Dark' },
                    { value: 'system' as Theme, icon: Monitor, label: 'System' },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updateSetting('theme', theme.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        settings.theme === theme.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <theme.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <label className="text-sm font-medium">Language</label>
                <select
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value as Language)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Sound Effects</label>
                  <p className="text-xs text-muted-foreground">Play sounds for notifications and actions</p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(v: boolean) => updateSetting('soundEffects', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto Save</label>
                  <p className="text-xs text-muted-foreground">Automatically save your changes</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(v: boolean) => updateSetting('autoSave', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Push Notifications</label>
                  <p className="text-xs text-muted-foreground">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(v: boolean) => updateSetting('pushNotifications', v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Email Notifications</label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v: boolean) => updateSetting('emailNotifications', v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Study Reminders</label>
                  <p className="text-xs text-muted-foreground">Get reminded about your study sessions</p>
                </div>
                <Switch
                  checked={settings.studyReminders}
                  onCheckedChange={(v: boolean) => updateSetting('studyReminders', v)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Reminder Time</label>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSetting('reminderTime', e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    readOnly
                  />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card-strong border-destructive/20">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card className="glass-card-strong border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold capitalize">{user?.subscription || 'free'}</div>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
