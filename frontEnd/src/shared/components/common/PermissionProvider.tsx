import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import apiClient from '@/shared/api/client'
import type { AxiosResponse } from 'axios'

interface UserPermissions {
  id: number
  username: string
  groups: { id: number; name: string }[]
  permissions: string[]
  is_superuser: boolean
}

interface PermissionContextType {
  permissions: string[]
  isSuperuser: boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  loading: boolean
  refreshPermissions: () => Promise<void>
}

const PermissionContext = createContext<PermissionContextType | null>(null)

export function usePermission() {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermission must be used within PermissionProvider')
  }
  return context
}

interface PermissionProviderProps {
  children: ReactNode
  userId: number | null
}

export function PermissionProvider({ children, userId }: PermissionProviderProps) {
  const [userPerms, setUserPerms] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPermissions = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }
    try {
      const res: AxiosResponse<UserPermissions> = await apiClient.get(`/user-permissions/${userId}/my_permissions/`)
      setUserPerms(res.data)
    } catch {
      // 权限获取失败，设置为空
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const hasPermission = useCallback(
    (permission: string) => {
      if (!userPerms) return false
      if (userPerms.is_superuser) return true
      return userPerms.permissions.includes(permission)
    },
    [userPerms],
  )

  const hasAnyPermission = useCallback(
    (perms: string[]) => {
      if (!userPerms) return false
      if (userPerms.is_superuser) return true
      return perms.some((p) => userPerms.permissions.includes(p))
    },
    [userPerms],
  )

  return (
    <PermissionContext.Provider
      value={{
        permissions: userPerms?.permissions ?? [],
        isSuperuser: userPerms?.is_superuser ?? false,
        hasPermission,
        hasAnyPermission,
        loading,
        refreshPermissions: fetchPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}
