import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import { LandingLayout } from '@/components/layout/LandingLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

// Landing Pages
import { LandingPage } from '@/pages/LandingPage'
import { AboutPage } from '@/pages/AboutPage'
import { FeaturesPage } from '@/pages/FeaturesPage'
import { PricingPage } from '@/pages/PricingPage'
import { ContactPage } from '@/pages/ContactPage'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// App Pages
import { DashboardPage } from '@/pages/app/DashboardPage'
import { SubjectsPage } from '@/pages/app/SubjectsPage'
import { TasksPage } from '@/pages/app/TasksPage'
import { StudyPlannerPage } from '@/pages/app/StudyPlannerPage'
import { CalendarPage } from '@/pages/app/CalendarPage'
import { AnalyticsPage } from '@/pages/app/AnalyticsPage'
import { FocusPage } from '@/pages/app/FocusPage'
import { ChatPage } from '@/pages/app/ChatPage'
import { NotificationsPage } from '@/pages/app/NotificationsPage'
import { SettingsPage } from '@/pages/app/SettingsPage'
import { ProfilePage } from '@/pages/app/ProfilePage'

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { UserManagementPage } from '@/pages/admin/UserManagementPage'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'

function App() {
  const { fetchUser, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token && !isAuthenticated) {
      fetchUser()
    }
  }, [])

  return (
    <Routes>
      {/* Landing Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* App Routes - Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/planner" element={<StudyPlannerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
