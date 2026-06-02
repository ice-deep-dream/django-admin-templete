import { apiClient } from '@/shared/api'
import type { Permission, UserPermissions } from '@/shared/types'

export const permissionApi = {
  getAll: () => apiClient.get<Record<string, Permission[]>>('/permissions/list_permissions/'),
}

export const userPermissionApi = {
  getMyPermissions: (userId: number) =>
    apiClient.get<UserPermissions>(`/user-permissions/${userId}/my_permissions/`),
}
