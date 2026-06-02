import { apiClient } from '@/shared/api'
import type { DashboardStats } from '@/shared/types'

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats/'),
}
