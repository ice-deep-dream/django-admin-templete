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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  Refresh as RefreshIcon,
  Description as PostIcon,
  Receipt as InvoiceIcon,
  PersonOutlined as ProfileIcon,
} from '@mui/icons-material'
import { PageLayout } from '@/shared/components/layout'
import type { SearchConfig, ActionButton, TabItem } from '@/shared/components/layout'
import {
  usePosts, useCreatePost, useDeletePost,
  useInvoices, useCreateInvoice, useDeleteInvoice,
  useProfiles, useCreateProfile, useDeleteProfile,
  useUsers,
} from '@/shared/hooks'
import type { Post, Invoice, Profile } from '@/shared/types'
import { usePermission } from '@/shared/components/common/PermissionProvider'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

type TabType = 'posts' | 'invoices' | 'profiles'

function PostsTable() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [searchTerm, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '' })
  const [error, setError] = useState<string | null>(null)

  const { data: postsData, isLoading } = usePosts({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm || undefined,
  })
  const { data: usersData } = useUsers({ page: 1, page_size: 100 })

  const posts = postsData?.list ?? []
  const totalCount = postsData?.pagination.total ?? 0
  const users = usersData?.list ?? []

  const createPost = useCreatePost()
  const deletePost = useDeletePost()

  const handleSubmit = async () => {
    try {
      await createPost.mutateAsync(formData)
      setDialogOpen(false)
      setFormData({ title: '' })
    } catch (err) {
      console.error('Failed to save post:', err)
      setError(t('content.saveFailed'))
    }
  }

  const handleDelete = async (post: Post) => {
    if (!confirm(t('content.confirmDelete', { name: post.title }))) return
    try {
      await deletePost.mutateAsync(post.id)
    } catch (err) {
      console.error('Failed to delete post:', err)
      setError(t('content.deleteFailed'))
    }
  }

  const getUserName = (userId: number) => {
    return users.find((u) => u.id === userId)?.username || t('content.unknownUser')
  }

  const search: SearchConfig = {
    placeholder: t('content.searchPostPlaceholder'),
    onSearch: (value) => {
      setSearch(value)
      setPage(0)
    },
  }

  const actions: ActionButton[] = [
    {
      label: t('content.addPost'),
      onClick: () => setDialogOpen(true),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('example.add_post'),
    },
    {
      label: t('common.refresh'),
      onClick: () => qc.invalidateQueries({ queryKey: ['posts'] }),
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('content.postsTitle')}
      subtitle={t('content.postsSubtitle', { count: totalCount })}
      search={search}
      actions={actions}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('content.title')}</TableCell>
                <TableCell>{t('content.author')}</TableCell>
                <TableCell>{t('content.weight')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {post.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getUserName(post.user)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{post.weight}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => setDialogOpen(true)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(post)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('content.addPost')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('content.title')}
            value={formData.title}
            onChange={(e) => setFormData({ title: e.target.value })}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{t('common.add')}</Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}

function InvoicesTable() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [searchTerm, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState<string | null>(null)

  const { data: invoicesData, isLoading } = useInvoices({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm || undefined,
  })
  const { data: usersData } = useUsers({ page: 1, page_size: 100 })

  const invoices = invoicesData?.list ?? []
  const totalCount = invoicesData?.pagination.total ?? 0
  const users = usersData?.list ?? []

  const createInvoice = useCreateInvoice()
  const deleteInvoice = useDeleteInvoice()

  const handleSubmit = async () => {
    try {
      await createInvoice.mutateAsync(formData)
      setDialogOpen(false)
      setFormData({ name: '' })
    } catch (err) {
      console.error('Failed to save invoice:', err)
      setError(t('content.saveFailed'))
    }
  }

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(t('content.confirmDelete', { name: invoice.name }))) return
    try {
      await deleteInvoice.mutateAsync(invoice.id)
    } catch (err) {
      console.error('Failed to delete invoice:', err)
      setError(t('content.deleteFailed'))
    }
  }

  const getUserName = (userId: number) => {
    return users.find((u) => u.id === userId)?.username || t('content.unknownUser')
  }

  const search: SearchConfig = {
    placeholder: t('content.searchInvoicePlaceholder'),
    onSearch: (value) => {
      setSearch(value)
      setPage(0)
    },
  }

  const actions: ActionButton[] = [
    {
      label: t('content.addInvoice'),
      onClick: () => setDialogOpen(true),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('example.add_invoice'),
    },
    {
      label: t('common.refresh'),
      onClick: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && invoices.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('content.invoicesTitle')}
      subtitle={t('content.invoicesSubtitle', { count: totalCount })}
      search={search}
      actions={actions}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('content.invoiceName')}</TableCell>
                <TableCell>{t('content.user')}</TableCell>
                <TableCell>{t('content.itemCount')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {invoice.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getUserName(invoice.user)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{t('content.itemsCount', { count: invoice.items.length })}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => setDialogOpen(true)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(invoice)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('content.addInvoice')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('content.invoiceName')}
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{t('common.add')}</Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}

function ProfilesTable() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [searchTerm, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState<string | null>(null)

  const { data: profilesData, isLoading } = useProfiles({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm || undefined,
  })

  const profiles = profilesData?.list ?? []
  const totalCount = profilesData?.pagination.total ?? 0

  const createProfile = useCreateProfile()
  const deleteProfile = useDeleteProfile()

  const handleSubmit = async () => {
    try {
      await createProfile.mutateAsync(formData)
      setDialogOpen(false)
      setFormData({ name: '' })
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError(t('content.saveFailed'))
    }
  }

  const handleDelete = async (profile: Profile) => {
    if (!confirm(t('content.confirmDelete', { name: profile.name }))) return
    try {
      await deleteProfile.mutateAsync(profile.id)
    } catch (err) {
      console.error('Failed to delete profile:', err)
      setError(t('content.deleteFailed'))
    }
  }

  const search: SearchConfig = {
    placeholder: t('content.searchProfilePlaceholder'),
    onSearch: (value) => {
      setSearch(value)
      setPage(0)
    },
  }

  const actions: ActionButton[] = [
    {
      label: t('content.addProfile'),
      onClick: () => setDialogOpen(true),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('example.add_profile'),
    },
    {
      label: t('common.refresh'),
      onClick: () => qc.invalidateQueries({ queryKey: ['profiles'] }),
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && profiles.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('taxonomy.configManagement')}
      subtitle={t('taxonomy.configSubtitle', { count: totalCount })}
      search={search}
      actions={actions}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('content.profileName')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {profile.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => setDialogOpen(true)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(profile)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('content.addProfile')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('content.profileName')}
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>{t('common.add')}</Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}

export function ContentPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabType>('posts')

  const tabs: TabItem[] = [
    { label: t('content.tabs.posts'), value: 'posts', icon: <PostIcon /> },
    { label: t('content.tabs.invoices'), value: 'invoices', icon: <InvoiceIcon /> },
    { label: t('content.tabs.profiles'), value: 'profiles', icon: <ProfileIcon /> },
  ]

  return (
    <PageLayout
      variant="tab"
      title={t('content.title')}
      subtitle={t('content.subtitle')}
      tabs={tabs}
      activeTab={tab}
      onTabChange={(v) => setTab(v as TabType)}
    >
      {tab === 'posts' && <PostsTable />}
      {tab === 'invoices' && <InvoicesTable />}
      {tab === 'profiles' && <ProfilesTable />}
    </PageLayout>
  )
}
