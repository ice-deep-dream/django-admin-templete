import { Navigate } from 'react-router-dom'
import { usePermission } from './PermissionProvider'
import { Box, CircularProgress } from '@mui/material'

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: string
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { hasPermission, loading } = usePermission()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (permission && !hasPermission(permission)) {
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />
  }

  return <>{children}</>
}
