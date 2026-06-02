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
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { PageLayout } from '@/shared/components'
import type { SearchConfig, ActionButton } from '@/shared/components'
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, usePermissions } from '@/shared/hooks'
import type { Group, Permission } from '@/shared/types'
import { usePermission } from '@/shared/components/common/PermissionProvider'
import { useTranslation } from 'react-i18next'

export function RolesPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const [searchTerm, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as number[],
  })
  const [error, setError] = useState<string | null>(null)

  const { data: groupsData, isLoading } = useGroups({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm || undefined,
  })
  const { data: permissionsData } = usePermissions()

  const groups = groupsData?.list ?? []
  const totalCount = groupsData?.pagination.total ?? 0
  const permissions: Permission[] = Array.isArray(permissionsData)
    ? permissionsData
    : permissionsData?.list ?? []

  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()
  const deleteGroup = useDeleteGroup()

  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    const parts = perm.codename.split('_')
    const module = parts.length > 1 ? parts[0] : 'other'
    if (!acc[module]) acc[module] = []
    acc[module].push(perm)
    return acc
  }, {})

  const moduleLabels: Record<string, string> = {
    add: '添加',
    change: '修改',
    delete: '删除',
    view: '查看',
    other: '其他',
  }

  const handleOpenDialog = (group?: Group) => {
    if (group) {
      setSelectedGroup(group)
      setFormData({
        name: group.name,
        permissions: group.permissions?.map((p) => typeof p === 'number' ? p : p.id) ?? [],
      })
    } else {
      setSelectedGroup(null)
      setFormData({ name: '', permissions: [] })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedGroup(null)
  }

  const handleSubmit = async () => {
    try {
      if (selectedGroup) {
        await updateGroup.mutateAsync({ id: selectedGroup.id, data: formData })
      } else {
        await createGroup.mutateAsync(formData)
      }
      handleCloseDialog()
    } catch (err) {
      console.error('Failed to save group:', err)
      setError(t('roles.saveFailed'))
    }
  }

  const handleDelete = async (group: Group) => {
    if (!confirm(t('roles.confirmDelete', { name: group.name }))) return
    try {
      await deleteGroup.mutateAsync(group.id)
    } catch (err) {
      console.error('Failed to delete group:', err)
      setError(t('roles.deleteFailed'))
    }
  }

  const handlePermissionToggle = (permId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((id) => id !== permId)
        : [...prev.permissions, permId],
    }))
  }

  const handleModuleToggle = (modulePerms: Permission[]) => {
    const modulePermIds = modulePerms.map((p) => p.id)
    const allSelected = modulePermIds.every((id) => formData.permissions.includes(id))
    if (allSelected) {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !modulePermIds.includes(id)),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...modulePermIds])],
      }))
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
    placeholder: t('roles.searchPlaceholder'),
    onSearch: (value) => {
      setSearch(value)
      setPage(0)
    },
  }

  const actions: ActionButton[] = [
    {
      label: t('roles.addRole'),
      onClick: () => handleOpenDialog(),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('auth.add_group'),
    },
    {
      label: t('common.refresh'),
      onClick: () => {},
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && groups.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('roles.title')}
      subtitle={t('roles.subtitle', { count: totalCount })}
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
                <TableCell>{t('roles.roleName')}</TableCell>
                <TableCell>{t('roles.permissionCount')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {group.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${group.permissions?.length ?? 0} ${t('roles.permissions')}`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('auth.change_group') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleOpenDialog(group)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('auth.delete_group') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(group)}>
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
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedGroup ? t('roles.editRole') : t('roles.addRole')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('roles.roleName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              size="small"
            />
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {t('roles.selectPermissions')}
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {Object.entries(groupedPermissions).map(([module, modulePerms]) => {
                const allSelected = modulePerms.every((p) => formData.permissions.includes(p.id))
                const someSelected = modulePerms.some((p) => formData.permissions.includes(p.id))
                return (
                  <Accordion key={module} defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            onChange={() => handleModuleToggle(modulePerms)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={moduleLabels[module] || module}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 4 }}>
                      {modulePerms.map((perm) => (
                        <FormControlLabel
                          key={perm.id}
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => handlePermissionToggle(perm.id)}
                              size="small"
                            />
                          }
                          label={perm.name}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedGroup ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}
