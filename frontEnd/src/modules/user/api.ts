import { apiClient } from '@/shared/api'
import type { User, Group, GroupInput, PaginationParams, PaginatedResponse } from '@/shared/types'

export const userApi = {
  getList: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<User>>('/users/', { params }),
  getById: (id: number) => apiClient.get<User>(`/users/${id}/`),
  create: (data: Partial<User>) => apiClient.post<User>('/users/', data),
  update: (id: number, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}/`),
}

export const groupApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Group>>('/groups/', { params }),
  getById: (id: number) => apiClient.get<Group>(`/groups/${id}/`),
  create: (data: GroupInput) => apiClient.post<Group>('/groups/', data),
  update: (id: number, data: GroupInput) =>
    apiClient.put<Group>(`/groups/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/groups/${id}/`),
}
