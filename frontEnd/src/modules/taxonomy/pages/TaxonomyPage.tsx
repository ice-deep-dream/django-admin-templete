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
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  Refresh as RefreshIcon,
  LocalOffer as TagIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
} from '@mui/icons-material'
import { PageLayout } from '@/shared/components'
import type { TabItem } from '@/shared/components'
import {
  useTags, useCreateTag, useDeleteTag,
  useCategories, useCreateCategory, useDeleteCategory,
  useLabels, useCreateLabel, useDeleteLabel,
} from '@/shared/hooks'
import type { Tag, Category, Label } from '@/shared/types'
import { usePermission } from '@/shared/components/common/PermissionProvider'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

type TabType = 'tags' | 'categories' | 'labels'

function TagsTable() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useTags({
    page: page + 1,
    page_size: rowsPerPage,
    search: search || undefined,
  })

  const tags = data?.list ?? []
  const totalCount = data?.pagination.total ?? 0

  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()

  const handleSubmit = async () => {
    try {
      await createTag.mutateAsync(formData)
      setDialogOpen(false)
      setFormData({ name: '' })
    } catch (err) {
      console.error('Failed to save tag:', err)
      setError(t('taxonomy.saveFailed'))
    }
  }

  const handleDelete = async (tag: Tag) => {
    if (!confirm(t('taxonomy.confirmDelete', { name: tag.name }))) return
    try {
      await deleteTag.mutateAsync(tag.id)
    } catch (err) {
      console.error('Failed to delete tag:', err)
      setError(t('taxonomy.deleteFailed'))
    }
  }

  if (isLoading && tags.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder={t('taxonomy.searchPlaceholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          size="small"
          sx={{ width: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasPermission('example.add_tag') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} size="small">
              {t('taxonomy.addTag')}
            </Button>
          )}
          <IconButton onClick={() => qc.invalidateQueries({ queryKey: ['tags'] })} size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

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
                <TableCell>{t('taxonomy.tagName')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {tag.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('example.change_tag') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => setDialogOpen(true)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('example.delete_tag') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(tag)}>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('taxonomy.addTag')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('taxonomy.tagName')}
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
    </Box>
  )
}

function CategoriesTable() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useCategories({
    page: page + 1,
    page_size: rowsPerPage,
    search: search || undefined,
  })

  const categories = data?.list ?? []
  const totalCount = data?.pagination.total ?? 0

  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()

  const handleSubmit = async () => {
    try {
      await createCategory.mutateAsync(formData)
      setDialogOpen(false)
      setFormData({ name: '' })
    } catch (err) {
      console.error('Failed to save category:', err)
      setError(t('taxonomy.saveFailed'))
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(t('taxonomy.confirmDelete', { name: category.name }))) return
    try {
      await deleteCategory.mutateAsync(category.id)
    } catch (err) {
      console.error('Failed to delete category:', err)
      setError(t('taxonomy.deleteFailed'))
    }
  }

  if (isLoading && categories.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder={t('taxonomy.searchPlaceholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          size="small"
          sx={{ width: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasPermission('example.add_category') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} size="small">
              {t('taxonomy.addCategory')}
            </Button>
          )}
          <IconButton onClick={() => qc.invalidateQueries({ queryKey: ['categories'] })} size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

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
                <TableCell>{t('taxonomy.categoryName')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('example.change_category') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => setDialogOpen(true)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('example.delete_category') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(category)}>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('taxonomy.addCategory')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('taxonomy.categoryName')}
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
    </Box>
  )
}

function LabelsTable() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useLabels({
    page: page + 1,
    page_size: rowsPerPage,
    search: search || undefined,
  })

  const labels = data?.list ?? []
  const totalCount = data?.pagination.total ?? 0

  const createLabel = useCreateLabel()
  const deleteLabel = useDeleteLabel()

  const handleSubmit = async () => {
    try {
      await createLabel.mutateAsync(formData)
      setDialogOpen(false)
      setFormData({ name: '' })
    } catch (err) {
      console.error('Failed to save label:', err)
      setError(t('taxonomy.saveFailed'))
    }
  }

  const handleDelete = async (label: Label) => {
    if (!confirm(t('taxonomy.confirmDelete', { name: label.name }))) return
    try {
      await deleteLabel.mutateAsync(label.id)
    } catch (err) {
      console.error('Failed to delete label:', err)
      setError(t('taxonomy.deleteFailed'))
    }
  }

  if (isLoading && labels.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder={t('taxonomy.searchPlaceholder')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          size="small"
          sx={{ width: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasPermission('example.add_label') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} size="small">
              {t('taxonomy.addLabel')}
            </Button>
          )}
          <IconButton onClick={() => qc.invalidateQueries({ queryKey: ['labels'] })} size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

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
                <TableCell>{t('taxonomy.labelName')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labels.map((label) => (
                <TableRow key={label.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {label.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('example.change_label') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => setDialogOpen(true)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('example.delete_label') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(label)}>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          labelRowsPerPage={t('common.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => t('common.displayRows', { from, to, count })}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('taxonomy.addLabel')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('taxonomy.labelName')}
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
    </Box>
  )
}

export function TaxonomyPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<TabType>('tags')

  const tabs: TabItem[] = [
    { label: t('taxonomy.tabs.tags'), value: 'tags', icon: <TagIcon /> },
    { label: t('taxonomy.tabs.categories'), value: 'categories', icon: <CategoryIcon /> },
    { label: t('taxonomy.tabs.labels'), value: 'labels', icon: <LabelIcon /> },
  ]

  return (
    <PageLayout
      variant="tab"
      title={t('taxonomy.title')}
      subtitle={t('taxonomy.subtitle')}
      tabs={tabs}
      activeTab={tab}
      onTabChange={(v) => setTab(v as TabType)}
    >
      {tab === 'tags' && <TagsTable />}
      {tab === 'categories' && <CategoriesTable />}
      {tab === 'labels' && <LabelsTable />}
    </PageLayout>
  )
}
