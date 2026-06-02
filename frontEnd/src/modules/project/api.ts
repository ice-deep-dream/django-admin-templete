import { apiClient } from '@/shared/api'
import type { Project, Task, PaginationParams, PaginatedResponse } from '@/shared/types'

export const projectApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Project>>('/projects/', { params }),
  getById: (id: number) => apiClient.get<Project>(`/projects/${id}/`),
  create: (data: Partial<Project>) => apiClient.post<Project>('/projects/', data),
  update: (id: number, data: Partial<Project>) =>
    apiClient.put<Project>(`/projects/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/projects/${id}/`),
}

export const taskApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Task>>('/tasks/', { params }),
  getById: (id: number) => apiClient.get<Task>(`/tasks/${id}/`),
  create: (data: Partial<Task>) => apiClient.post<Task>('/tasks/', data),
  update: (id: number, data: Partial<Task>) =>
    apiClient.put<Task>(`/tasks/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/tasks/${id}/`),
}
