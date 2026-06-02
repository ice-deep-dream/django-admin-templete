import { useState } from 'react'
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
  TablePagination,
  Chip,
  Avatar,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { PageLayout } from '@/shared/components'
import type { SearchConfig, ActionButton } from '@/shared/components'
import { useUsers, useGroups, useCreateUser, useUpdateUser, useDeleteUser } from '@/shared/hooks'
import type { User, Group } from '@/shared/types'
import { usePermission } from '@/shared/components/common/PermissionProvider'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
}

const priorityColors: Record<string, 'info' | 'warning' | 'error'> = {
  low: 'info',
  medium: 'warning',
  high: 'error',
}

export function UsersPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [searchTerm, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_active: true,
    is_staff: false,
    groups: [] as number[],
  })
  const [error, setError] = useState<string | null>(null)

  const { data: usersData, isLoading } = useUsers({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm || undefined,
  })
  const { data: groupsData } = useGroups({ page: 1, page_size: 100 })

  const users = usersData?.list ?? []
  const totalCount = usersData?.pagination.total ?? 0
  const groups: Group[] = groupsData?.list ?? []

  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const statusLabels: Record<string, string> = {
    active: t('users.status.active'),
    inactive: t('users.status.inactive'),
    pending: t('users.status.pending'),
  }

  const approvalLabels: Record<string, string> = {
    new: t('users.approval.new'),
    reviewed: t('users.approval.reviewed'),
    approved: t('users.approval.approved'),
    rejected: t('users.approval.rejected'),
  }

  const priorityLabels: Record<string, string> = {
    low: t('users.priority.low'),
    medium: t('users.priority.medium'),
    high: t('users.priority.high'),
  }

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user)
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: '',
        is_active: user.is_active,
        is_staff: user.is_staff,
        groups: user.groups?.map((g) => g.id) ?? [],
      })
    } else {
      setSelectedUser(null)
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        is_active: true,
        is_staff: false,
        groups: [],
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedUser(null)
  }

  const handleSubmit = async () => {
    try {
      const payload: Record<string, unknown> = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        is_active: formData.is_active,
        is_staff: formData.is_staff,
      }
      if (formData.password) {
        payload.password = formData.password
      }
      if (selectedUser) {
        await updateUser.mutateAsync({ id: selectedUser.id, data: payload })
      } else {
        await createUser.mutateAsync(payload)
      }
      handleCloseDialog()
    } catch (err) {
      console.error('Failed to save user:', err)
      setError(t('users.saveFailed'))
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(t('users.confirmDelete', { name: user.username }))) return
    try {
      await deleteUser.mutateAsync(user.id)
    } catch (err) {
      console.error('Failed to delete user:', err)
      setError(t('users.deleteFailed'))
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const search: SearchConfig = {
    placeholder: t('users.searchPlaceholder'),
    onSearch: (value) => {
      setSearch(value)
      setPage(0)
    },
  }

  const actions: ActionButton[] = [
    {
      label: t('users.addUser'),
      onClick: () => handleOpenDialog(),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('example.add_user'),
    },
    {
      label: t('common.refresh'),
      onClick: () => qc.invalidateQueries({ queryKey: ['users'] }),
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('users.title')}
      subtitle={t('users.subtitle', { count: totalCount })}
      search={search}
      actions={actions}
    >

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('users.user')}</TableCell>
                <TableCell>{t('users.email')}</TableCell>
                <TableCell>{t('users.status.title')}</TableCell>
                <TableCell>{t('users.approval.title')}</TableCell>
                <TableCell>{t('users.priority.title')}</TableCell>
                <TableCell>{t('users.tags')}</TableCell>
                <TableCell>{t('users.lastLogin')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 13, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.first_name}{user.last_name}
                        </Typography>
                      </Box>
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
                      label={approvalLabels[user.approval]}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={priorityLabels[user.priority]}
                      color={priorityColors[user.priority]}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {user.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" sx={{ height: 20, fontSize: 11 }} />
                      ))}
                      {user.tags.length > 2 && (
                        <Chip label={`+${user.tags.length - 2}`} size="small" sx={{ height: 20, fontSize: 11 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : t('users.neverLogin')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('example.change_user') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('example.delete_user') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(user)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('pagination.perPage')}
          labelDisplayedRows={({ from, to, count }) => t('pagination.showingRange', { start: from, end: to, total: count })}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? t('users.editUser') : t('users.addUser')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('users.username')}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
              required
              size="small"
            />
            <TextField
              label={t('users.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              size="small"
            />
            <TextField
              label={selectedUser ? t('users.passwordPlaceholder') : t('users.password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              required={!selectedUser}
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('users.lastName')}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                fullWidth
                size="small"
              />
              <TextField
                label={t('users.firstName')}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                fullWidth
                size="small"
              />
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>{t('users.roles')}</InputLabel>
              <Select
                multiple
                value={formData.groups}
                label={t('users.roles')}
                onChange={(e) => setFormData({ ...formData, groups: e.target.value as number[] })}
                renderValue={(selected) => {
                  const selectedNames = selected.map((id) => groups.find((g) => g.id === id)?.name).filter(Boolean)
                  return selectedNames.join(', ') || t('users.noSelection')
                }}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label={t('users.enable')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_staff}
                    onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                  />
                }
                label={t('users.admin')}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedUser ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}
