import { apiClient } from '@/shared/api'
import type { Tag, Category, Label, Post, Invoice, Profile, User, PaginationParams, PaginatedResponse } from '@/shared/types'

export const tagApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Tag>>('/tags/', { params }),
  getById: (id: number) => apiClient.get<Tag>(`/tags/${id}/`),
  create: (data: Partial<Tag>) => apiClient.post<Tag>('/tags/', data),
  update: (id: number, data: Partial<Tag>) =>
    apiClient.put<Tag>(`/tags/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/tags/${id}/`),
}

export const categoryApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Category>>('/categories/', { params }),
  getById: (id: number) => apiClient.get<Category>(`/categories/${id}/`),
  create: (data: Partial<Category>) => apiClient.post<Category>('/categories/', data),
  update: (id: number, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/categories/${id}/`),
}

export const labelApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Label>>('/labels/', { params }),
  getById: (id: number) => apiClient.get<Label>(`/labels/${id}/`),
  create: (data: Partial<Label>) => apiClient.post<Label>('/labels/', data),
  update: (id: number, data: Partial<Label>) =>
    apiClient.put<Label>(`/labels/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/labels/${id}/`),
}

export const postApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Post>>('/posts/', { params }),
  getById: (id: number) => apiClient.get<Post>(`/posts/${id}/`),
  create: (data: Partial<Post>) => apiClient.post<Post>('/posts/', data),
  update: (id: number, data: Partial<Post>) =>
    apiClient.put<Post>(`/posts/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/posts/${id}/`),
}

export const invoiceApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Invoice>>('/invoices/', { params }),
  getById: (id: number) => apiClient.get<Invoice>(`/invoices/${id}/`),
  create: (data: Partial<Invoice>) =>
    apiClient.post<Invoice>('/invoices/', data),
  update: (id: number, data: Partial<Invoice>) =>
    apiClient.put<Invoice>(`/invoices/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/invoices/${id}/`),
}

export const profileApi = {
  getList: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Profile>>('/profiles/', { params }),
  getById: (id: number) => apiClient.get<Profile>(`/profiles/${id}/`),
  create: (data: Partial<Profile>) =>
    apiClient.post<Profile>('/profiles/', data),
  update: (id: number, data: Partial<Profile>) =>
    apiClient.put<Profile>(`/profiles/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/profiles/${id}/`),
}

export const userApi = {
  getList: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<User>>('/users/', { params }),
  getById: (id: number) => apiClient.get<User>(`/users/${id}/`),
}
