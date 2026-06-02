import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  PeopleOutlined as PeopleIcon,
  PersonOutlined as PersonOutlineIcon,
  FolderOutlined as FolderIcon,
  AssignmentOutlined as TaskIcon,
} from '@mui/icons-material'
import { PageLayout } from '@/shared/components'
import type { StatItem } from '@/shared/components'
import { useDashboardStats, useUsers, useProjects, useTasks } from '@/shared/hooks'
import type { DashboardStats, User, Project, Task } from '@/shared/types'

const months = [
  'dashboard.months.jan', 'dashboard.months.feb', 'dashboard.months.mar',
  'dashboard.months.apr', 'dashboard.months.may', 'dashboard.months.jun',
  'dashboard.months.jul', 'dashboard.months.aug', 'dashboard.months.sep',
  'dashboard.months.oct', 'dashboard.months.nov', 'dashboard.months.dec',
]

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: usersData } = useUsers({ page: 1, page_size: 5 })
  const { data: projectsData } = useProjects()
  const { data: tasksData } = useTasks()

  const users: User[] = usersData?.list ?? []
  const projects: Project[] = projectsData?.list ?? []
  const tasks: Task[] = tasksData?.list ?? []

  const statusLabels: Record<string, string> = {
    active: '活跃',
    inactive: '停用',
    pending: '待审核',
  }

  const priorityLabels: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
  }

  if (statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (statsError) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>加载数据失败</Alert>
        <Typography variant="body2" color="text.secondary">
          请确保后端服务器正在运行（http://127.0.0.1:8000）
        </Typography>
      </Box>
    )
  }

  if (!stats) return null

  const maxUserGrowth = Math.max(...(stats as DashboardStats).user_growth)

  const statCards: StatItem[] = [
    {
      label: '总用户数',
      value: (stats as DashboardStats).total_users,
      icon: <PeopleIcon />,
      color: 'primary',
      trend: { value: 12, positive: true },
    },
    {
      label: '活跃用户',
      value: (stats as DashboardStats).active_users,
      icon: <PersonOutlineIcon />,
      color: 'success',
      trend: { value: 8, positive: true },
    },
    {
      label: t('dashboard.stats.totalProjects'),
      value: (stats as DashboardStats).total_projects,
      icon: <FolderIcon />,
      color: 'info',
    },
    {
      label: t('dashboard.stats.totalTasks'),
      value: (stats as DashboardStats).total_tasks,
      icon: <TaskIcon />,
      color: 'warning',
    },
  ]

  return (
    <PageLayout
      variant="stats"
      title={t('dashboard.pageTitle')}
      subtitle={t('dashboard.pageSubtitle')}
      stats={statCards}
    >

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('dashboard.userGrowthTrend')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 180, px: 1 }}>
              {(stats as DashboardStats).user_growth.map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 40,
                      height: `${(value / maxUserGrowth) * 140}px`,
                      background: 'linear-gradient(180deg, #6366f1, #4f46e5)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      '&:hover': {
                        background: 'linear-gradient(180deg, #818cf8, #6366f1)',
                        transform: 'scaleY(1.05)',
                        transformOrigin: 'bottom',
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                    {t(months[index])}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('dashboard.recentActiveUsers')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('dashboard.username')}</TableCell>
                    <TableCell>{t('dashboard.email')}</TableCell>
                    <TableCell>{t('dashboard.status.title')}</TableCell>
                    <TableCell>{t('dashboard.priority.title')}</TableCell>
                    <TableCell>{t('dashboard.lastLogin')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          {user.username}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[user.status]}
                          color={statusColors[user.status]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={priorityLabels[user.priority]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : t('dashboard.neverLogin')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('dashboard.projectProgress')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {projects.filter((p) => p.is_active).slice(0, 4).map((project) => {
                const projectTasks = tasks.filter((task) => task.project === project.id)
                const progress = projectTasks.length > 0
                  ? Math.min(Math.round((projectTasks.length / 10) * 100), 100)
                  : 0
                return (
                  <Box key={project.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {t('dashboard.taskCount', { count: projectTasks.length })}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Paper>

          <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('dashboard.systemInfo')}
            </Typography>
            <List sx={{ p: 0 }}>
              {[
                { label: t('dashboard.stats.totalUsers'), value: (stats as DashboardStats).total_users },
                { label: t('dashboard.stats.activeUsers'), value: (stats as DashboardStats).active_users },
                { label: t('dashboard.stats.totalProjects'), value: (stats as DashboardStats).total_projects },
                { label: t('dashboard.stats.totalTasks'), value: (stats as DashboardStats).total_tasks },
                { label: t('dashboard.stats.totalTags'), value: (stats as DashboardStats).total_tags },
                { label: t('dashboard.stats.totalCategories'), value: (stats as DashboardStats).total_categories },
              ].map((item, index) => (
                <Box key={index}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={
                        <Typography variant="body1" sx={{ mt: 0.25, fontWeight: 500 }}>
                          {item.value.toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < 5 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  )
}
