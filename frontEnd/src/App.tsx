import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/components'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { UsersPage } from '@/modules/user/pages/UsersPage'
import { ProjectsPage, TasksPage } from '@/modules/project/pages/ProjectsPage'
import { TaxonomyPage } from '@/modules/taxonomy/pages/TaxonomyPage'
import { ContentPage } from '@/modules/taxonomy/pages/ContentPage'
import { SettingsPage } from '@/modules/settings/pages/SettingsPage'
import { RolesPage } from '@/modules/role/pages/RolesPage'
import { TemplateSimplePage } from '@/modules/template/pages/TemplateSimplePage'
import { TemplateTabPage } from '@/modules/template/pages/TemplateTabPage'
import { TemplateActionPage } from '@/modules/template/pages/TemplateActionPage'
import { TemplateSearchPage } from '@/modules/template/pages/TemplateSearchPage'
import { PermissionProvider } from '@/shared/components/common/PermissionProvider'
import { useAuthStore } from '@/shared/stores'
import { authApi } from '@/shared/api/auth'
import { useState, useEffect, useRef } from 'react'

let sessionValidated = false

function ProtectedRoutes() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [isValidating, setIsValidating] = useState(!sessionValidated)
  const [isValid, setIsValid] = useState(sessionValidated)
  const validatingRef = useRef(false)

  useEffect(() => {
    if (sessionValidated || validatingRef.current) {
      setIsValidating(false)
      setIsValid(!!user)
      return
    }

    if (!user) {
      setIsValidating(false)
      return
    }

    validatingRef.current = true

    const validateSession = async () => {
      try {
        const res = await authApi.getMe()
        if (res.data.id === user.id) {
          sessionValidated = true
          setIsValid(true)
        } else {
          logout()
        }
      } catch {
        logout()
      } finally {
        setIsValidating(false)
        validatingRef.current = false
      }
    }

    validateSession()
  }, [user, logout])

  if (isValidating) {
    return null
  }

  if (!user || !isValid) {
    return <Navigate to="/login" replace />
  }

  return (
    <PermissionProvider userId={user.id}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="taxonomy" element={<TaxonomyPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="template/simple" element={<TemplateSimplePage />} />
          <Route path="template/tab" element={<TemplateTabPage />} />
          <Route path="template/action" element={<TemplateActionPage />} />
          <Route path="template/search" element={<TemplateSearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </PermissionProvider>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  )
}

export default App
