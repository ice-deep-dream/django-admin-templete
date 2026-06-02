import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/modules/dashboard/api'
import { userApi, groupApi } from '@/modules/user/api'
import { projectApi, taskApi } from '@/modules/project/api'
import { permissionApi, userPermissionApi } from '@/modules/role/api'
import { tagApi, categoryApi, labelApi, postApi, invoiceApi, profileApi } from '@/modules/taxonomy/api'
import type { PaginationParams, GroupInput, Tag, Category, Label, Post, Invoice, Profile } from '@/shared/types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then((res) => res.data),
  })
}

export function useUsers(params: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getList(params).then((res) => res.data),
  })
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getById(id!).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => userApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => userApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useProjects(params?: PaginationParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectApi.getList(params).then((res) => res.data),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; is_active: boolean }) => projectApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; is_active: boolean } }) => projectApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useTasks(params?: PaginationParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskApi.getList(params).then((res) => res.data),
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; project: number }) => taskApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; project: number } }) => taskApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => taskApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useGroups(params?: PaginationParams) {
  return useQuery({
    queryKey: ['groups', params],
    queryFn: () => groupApi.getList(params).then((res) => res.data),
  })
}

export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: GroupInput) => groupApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}

export function useUpdateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GroupInput }) => groupApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}

export function useDeleteGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => groupApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionApi.getAll().then((res) => res.data),
  })
}

export function useUserPermissions(userId: number | null) {
  return useQuery({
    queryKey: ['userPermissions', userId],
    queryFn: () => userPermissionApi.getMyPermissions(userId!).then((res) => res.data),
    enabled: !!userId,
  })
}

export function useTags(params?: PaginationParams) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => tagApi.getList(params).then((res) => res.data),
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Tag>) => tagApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  })
}

export function useUpdateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Tag> }) => tagApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tagApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  })
}

export function useCategories(params?: PaginationParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryApi.getList(params).then((res) => res.data),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Category>) => categoryApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) => categoryApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoryApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useLabels(params?: PaginationParams) {
  return useQuery({
    queryKey: ['labels', params],
    queryFn: () => labelApi.getList(params).then((res) => res.data),
  })
}

export function useCreateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Label>) => labelApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels'] }),
  })
}

export function useUpdateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Label> }) => labelApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels'] }),
  })
}

export function useDeleteLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => labelApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels'] }),
  })
}

export function usePosts(params?: PaginationParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postApi.getList(params).then((res) => res.data),
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Post>) => postApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) => postApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => postApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useInvoices(params?: PaginationParams) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceApi.getList(params).then((res) => res.data),
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Invoice>) => invoiceApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}

export function useUpdateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Invoice> }) => invoiceApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}

export function useDeleteInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => invoiceApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}

export function useProfiles(params?: PaginationParams) {
  return useQuery({
    queryKey: ['profiles', params],
    queryFn: () => profileApi.getList(params).then((res) => res.data),
  })
}

export function useCreateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Profile>) => profileApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Profile> }) => profileApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }),
  })
}

export function useDeleteProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => profileApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }),
  })
}
