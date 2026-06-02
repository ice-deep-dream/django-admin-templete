import { useState } from 'react'
import { PageLayout } from '@/shared/components'
import type { ActionButton } from '@/shared/components'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Add as AddIcon, Download as DownloadIcon, Refresh as RefreshIcon, EditOutlined as EditIcon, DeleteOutlined as DeleteIcon, Key as KeyIcon } from '@mui/icons-material'

const mockData = [
  { name: 'Alice', email: 'alice@email.com', role: 'template.roles.admin', status: 'active', lastLogin: '2024-01-15', permissions: 28 },
  { name: 'Bob', email: 'bob@email.com', role: 'template.roles.editor', status: 'active', lastLogin: '2024-01-14', permissions: 12 },
  { name: 'Charlie', email: 'charlie@email.com', role: 'template.roles.viewer', status: 'inactive', lastLogin: '2023-12-20', permissions: 3 },
  { name: 'Diana', email: 'diana@email.com', role: 'template.roles.editor', status: 'active', lastLogin: '2024-01-13', permissions: 12 },
  { name: 'Edward', email: 'edward@email.com', role: 'template.roles.manager', status: 'active', lastLogin: '2024-01-12', permissions: 20 },
  { name: 'Fiona', email: 'fiona@email.com', role: 'template.roles.viewer', status: 'active', lastLogin: '2024-01-11', permissions: 3 },
  { name: 'George', email: 'george@email.com', role: 'template.roles.editor', status: 'inactive', lastLogin: '2023-11-05', permissions: 12 },
  { name: 'Helen', email: 'helen@email.com', role: 'template.roles.viewer', status: 'active', lastLogin: '2024-01-10', permissions: 3 },
  { name: 'Ivan', email: 'ivan@email.com', role: 'template.roles.manager', status: 'active', lastLogin: '2024-01-09', permissions: 20 },
  { name: 'Julia', email: 'julia@email.com', role: 'template.roles.editor', status: 'active', lastLogin: '2024-01-08', permissions: 12 },
]

const avatarColors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#7b1fa2']

const roleColors: Record<string, { bg: string; color: string }> = {
  'template.roles.admin': { bg: 'rgba(211,47,47,0.08)', color: 'error' },
  'template.roles.manager': { bg: 'rgba(237,108,2,0.08)', color: 'warning' },
  'template.roles.editor': { bg: 'rgba(25,118,210,0.08)', color: 'primary' },
  'template.roles.viewer': { bg: 'rgba(156,39,176,0.08)', color: 'secondary' },
}

export function TemplateActionPage() {
  const { t } = useTranslation()
  const [data] = useState(mockData)

  const actions: ActionButton[] = [
    {
      label: t('template.addUser'),
      onClick: () => alert(t('template.addUser')),
      variant: 'contained',
      startIcon: <AddIcon />,
    },
    {
      label: t('template.export'),
      onClick: () => alert(t('template.export')),
      variant: 'outlined',
      startIcon: <DownloadIcon />,
    },
    {
      label: t('common.refresh'),
      onClick: () => alert(t('common.refresh')),
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  return (
    <PageLayout
      variant="action"
      title={t('template.userManagement')}
      subtitle={t('template.userSubtitle', { count: data.length })}
      actions={actions}
    >
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.user')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.role')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.permissionCount')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.accountStatus')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.lastLogin')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const roleConfig = roleColors[row.role]
              const colorIndex = index % avatarColors.length
              return (
                <TableRow
                  key={row.email}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: avatarColors[colorIndex],
                        }}
                      >
                        {row.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                          {row.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(row.role)}
                      size="small"
                      sx={{
                        bgcolor: roleConfig.bg,
                        color: `${roleConfig.color}.main`,
                        fontWeight: 500,
                        fontSize: '0.6875rem',
                        border: 'none',
                        '& .MuiChip-label': { px: 1.5 },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <KeyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{row.permissions}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status === 'active' ? t('template.status.active') : t('template.status.inactive')}
                      size="small"
                      sx={{
                        bgcolor: row.status === 'active' ? 'rgba(46,125,50,0.08)' : 'rgba(158,158,158,0.08)',
                        color: row.status === 'active' ? 'success.main' : 'text.disabled',
                        fontWeight: 500,
                        fontSize: '0.6875rem',
                        border: 'none',
                        '& .MuiChip-label': { px: 1.5 },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{row.lastLogin}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" color="inherit">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  )
}
