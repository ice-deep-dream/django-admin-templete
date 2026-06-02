import { useState, useMemo } from 'react'
import { PageLayout } from '@/shared/components'
import type { SearchConfig, ActionButton } from '@/shared/components'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Add as AddIcon, FilterList as FilterIcon, EditOutlined as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const mockData = [
  { id: 'ORD-20240101', customer: 'Alice', email: 'alice@email.com', amount: 1200, status: 'completed', date: '2024-01-15', items: 3 },
  { id: 'ORD-20240102', customer: 'Bob', email: 'bob@email.com', amount: 850, status: 'pending', date: '2024-01-16', items: 1 },
  { id: 'ORD-20240103', customer: 'Charlie', email: 'charlie@email.com', amount: 2100, status: 'completed', date: '2024-01-17', items: 5 },
  { id: 'ORD-20240104', customer: 'Diana', email: 'diana@email.com', amount: 560, status: 'cancelled', date: '2024-01-18', items: 2 },
  { id: 'ORD-20240105', customer: 'Edward', email: 'edward@email.com', amount: 3400, status: 'pending', date: '2024-01-19', items: 8 },
  { id: 'ORD-20240106', customer: 'Fiona', email: 'fiona@email.com', amount: 780, status: 'completed', date: '2024-01-20', items: 2 },
  { id: 'ORD-20240107', customer: 'George', email: 'george@email.com', amount: 1560, status: 'completed', date: '2024-01-21', items: 4 },
  { id: 'ORD-20240108', customer: 'Helen', email: 'helen@email.com', amount: 420, status: 'cancelled', date: '2024-01-22', items: 1 },
  { id: 'ORD-20240109', customer: 'Ivan', email: 'ivan@email.com', amount: 2890, status: 'pending', date: '2024-01-23', items: 6 },
  { id: 'ORD-20240110', customer: 'Julia', email: 'julia@email.com', amount: 1750, status: 'completed', date: '2024-01-24', items: 3 },
  { id: 'ORD-20240111', customer: 'Kevin', email: 'kevin@email.com', amount: 930, status: 'completed', date: '2024-01-25', items: 2 },
  { id: 'ORD-20240112', customer: 'Linda', email: 'linda@email.com', amount: 4200, status: 'pending', date: '2024-01-26', items: 10 },
  { id: 'ORD-20240113', customer: 'Mike', email: 'mike@email.com', amount: 670, status: 'completed', date: '2024-01-27', items: 1 },
  { id: 'ORD-20240114', customer: 'Nancy', email: 'nancy@email.com', amount: 1890, status: 'cancelled', date: '2024-01-28', items: 4 },
  { id: 'ORD-20240115', customer: 'Oscar', email: 'oscar@email.com', amount: 2340, status: 'completed', date: '2024-01-29', items: 7 },
  { id: 'ORD-20240116', customer: 'Patty', email: 'patty@email.com', amount: 560, status: 'pending', date: '2024-01-30', items: 2 },
  { id: 'ORD-20240117', customer: 'Quinn', email: 'quinn@email.com', amount: 3100, status: 'completed', date: '2024-01-31', items: 9 },
  { id: 'ORD-20240118', customer: 'Rachel', email: 'rachel@email.com', amount: 890, status: 'completed', date: '2024-02-01', items: 3 },
  { id: 'ORD-20240119', customer: 'Steve', email: 'steve@email.com', amount: 1450, status: 'pending', date: '2024-02-02', items: 4 },
  { id: 'ORD-20240120', customer: 'Tina', email: 'tina@email.com', amount: 2780, status: 'completed', date: '2024-02-03', items: 6 },
]

const avatarColors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#7b1fa2']

export function TemplateSearchPage() {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')

  const filteredData = useMemo(() => {
    if (!keyword) return mockData
    const lower = keyword.toLowerCase()
    return mockData.filter(
      (item) =>
        item.id.toLowerCase().includes(lower) ||
        item.customer.includes(keyword) ||
        item.email.toLowerCase().includes(lower)
    )
  }, [keyword])

  const search: SearchConfig = {
    placeholder: t('template.searchOrderPlaceholder'),
    onSearch: setKeyword,
  }

  const actions: ActionButton[] = [
    {
      label: t('template.newOrder'),
      onClick: () => alert(t('template.newOrder')),
      variant: 'contained',
      startIcon: <AddIcon />,
    },
    {
      label: t('template.filter'),
      onClick: () => alert(t('template.filter')),
      variant: 'outlined',
      startIcon: <FilterIcon />,
    },
  ]

  const statusConfig: Record<string, { label: string; color: 'success' | 'warning' | 'error'; bg: string }> = {
    completed: { label: t('template.status.completed'), color: 'success', bg: 'rgba(46,125,50,0.08)' },
    pending: { label: t('template.status.pending'), color: 'warning', bg: 'rgba(237,108,2,0.08)' },
    cancelled: { label: t('template.status.cancelled'), color: 'error', bg: 'rgba(211,47,47,0.08)' },
  }

  return (
    <PageLayout
      variant="search"
      title={t('template.orderManagement')}
      subtitle={t('template.orderSubtitle', { count: mockData.length })}
      search={search}
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
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.orderId')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.customer')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="right">{t('template.amount')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.orderStatus')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.itemCount')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.date')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => {
                const status = statusConfig[row.status]
                const colorIndex = index % avatarColors.length
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '0.8125rem' }}>
                        {row.id}
                      </Typography>
                    </TableCell>
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
                          {row.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                            {row.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        ¥{row.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          bgcolor: status.bg,
                          color: `${status.color}.main`,
                          fontWeight: 500,
                          fontSize: '0.6875rem',
                          border: 'none',
                          '& .MuiChip-label': { px: 1.5 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{row.items}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{row.date}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title={t('common.view')}>
                          <IconButton size="small" color="inherit">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="text.secondary">{t('template.noResults')}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('template.tryAdjustSearch')}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('template.showing', { shown: filteredData.length, total: mockData.length })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('template.totalAmount', { amount: mockData.reduce((sum, item) => sum + item.amount, 0).toLocaleString() })}
        </Typography>
      </Box>
    </PageLayout>
  )
}
