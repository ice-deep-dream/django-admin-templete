import { usePermission } from './PermissionProvider'

interface HasPermissionProps {
  permission: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HasPermission({ permission, children, fallback = null }: HasPermissionProps) {
  const { hasPermission, loading } = usePermission()

  if (loading) return null

  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>
}

interface HasAnyPermissionProps {
  permissions: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HasAnyPermission({ permissions, children, fallback = null }: HasAnyPermissionProps) {
  const { hasAnyPermission, loading } = usePermission()

  if (loading) return null

  return hasAnyPermission(permissions) ? <>{children}</> : <>{fallback}</>
}
