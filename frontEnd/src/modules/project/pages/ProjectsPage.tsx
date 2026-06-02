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
  FormControlLabel,
  Switch,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { PageLayout } from '@/shared/components'
import type { SearchConfig, ActionButton } from '@/shared/components'
import { useProjects, useTasks, useCreateProject, useUpdateProject, useDeleteProject, useCreateTask, useUpdateTask, useDeleteTask } from '@/shared/hooks'
import type { Project, Task } from '@/shared/types'
import { usePermission } from '@/shared/components/common/PermissionProvider'
import { useTranslation } from 'react-i18next'

export function ProjectsPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const [searchTerm, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
  })
  const [error, setError] = useState<string | null>(null)

  const { data: projectsData, isLoading } = useProjects({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm || undefined,
  })

  const projects = projectsData?.list ?? []
  const totalCount = projectsData?.pagination.total ?? 0

  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setSelectedProject(project)
      setFormData({ name: project.name, is_active: project.is_active })
    } else {
      setSelectedProject(null)
      setFormData({ name: '', is_active: true })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedProject(null)
  }

  const handleSubmit = async () => {
    try {
      if (selectedProject) {
        await updateProject.mutateAsync({ id: selectedProject.id, data: formData })
      } else {
        await createProject.mutateAsync(formData)
      }
      handleCloseDialog()
    } catch (err) {
      console.error('Failed to save project:', err)
      setError(t('projects.saveFailed'))
    }
  }

  const handleDelete = async (project: Project) => {
    if (!confirm(t('projects.confirmDelete', { name: project.name }))) return
    try {
      await deleteProject.mutateAsync(project.id)
    } catch (err) {
      console.error('Failed to delete project:', err)
      setError(t('projects.deleteFailed'))
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
    placeholder: t('projects.searchPlaceholder'),
    onSearch: (value) => {
      setSearch(value)
      setPage(0)
    },
  }

  const actions: ActionButton[] = [
    {
      label: t('projects.addProject'),
      onClick: () => handleOpenDialog(),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('example.add_project'),
    },
    {
      label: t('common.refresh'),
      onClick: () => {},
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('projects.title')}
      subtitle={t('projects.subtitle', { count: totalCount })}
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
                <TableCell>{t('projects.projectName')}</TableCell>
                <TableCell>{t('projects.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {project.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={project.is_active ? t('projects.active') : t('projects.inactive')}
                      color={project.is_active ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('example.change_project') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleOpenDialog(project)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('example.delete_project') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(project)}>
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
        <DialogTitle>{selectedProject ? t('projects.editProject') : t('projects.addProject')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('projects.projectName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              }
              label={t('projects.enableProject')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedProject ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}

export function TasksPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const [searchTerm2, setSearch2] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    project: 1,
  })
  const [error, setError] = useState<string | null>(null)

  const { data: tasksData, isLoading } = useTasks({
    page: page + 1,
    page_size: rowsPerPage,
    search: searchTerm2 || undefined,
  })
  const { data: projectsData } = useProjects()

  const tasks = tasksData?.list ?? []
  const totalCount = tasksData?.pagination.total ?? 0
  const projects = projectsData?.list ?? []

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setSelectedTask(task)
      setFormData({ name: task.name, project: task.project })
    } else {
      setSelectedTask(null)
      setFormData({ name: '', project: 1 })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedTask(null)
  }

  const handleSubmit = async () => {
    try {
      if (selectedTask) {
        await updateTask.mutateAsync({ id: selectedTask.id, data: formData })
      } else {
        await createTask.mutateAsync(formData)
      }
      handleCloseDialog()
    } catch (err) {
      console.error('Failed to save task:', err)
      setError(t('tasks.saveFailed'))
    }
  }

  const handleDelete = async (task: Task) => {
    if (!confirm(t('tasks.confirmDelete', { name: task.name }))) return
    try {
      await deleteTask.mutateAsync(task.id)
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError(t('tasks.deleteFailed'))
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getProjectName = (projectId: number) => {
    return projects.find((p) => p.id === projectId)?.name || t('tasks.unknownProject')
  }

  const search2: SearchConfig = {
    placeholder: t('tasks.searchPlaceholder'),
    onSearch: (value) => {
      setSearch2(value)
      setPage(0)
    },
  }

  const actions2: ActionButton[] = [
    {
      label: t('tasks.addTask'),
      onClick: () => handleOpenDialog(),
      variant: 'contained',
      startIcon: <AddIcon />,
      disabled: !hasPermission('example.add_task'),
    },
    {
      label: t('common.refresh'),
      onClick: () => {},
      variant: 'outlined',
      startIcon: <RefreshIcon />,
    },
  ]

  if (isLoading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageLayout
      variant="search"
      title={t('tasks.title')}
      subtitle={t('tasks.subtitle', { count: totalCount })}
      search={search2}
      actions={actions2}
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
                <TableCell>{t('tasks.taskName')}</TableCell>
                <TableCell>{t('tasks.project')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {task.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getProjectName(task.project)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    {hasPermission('example.change_task') && (
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleOpenDialog(task)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('example.delete_task') && (
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(task)}>
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
        <DialogTitle>{selectedTask ? t('tasks.editTask') : t('tasks.addTask')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('tasks.taskName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedTask ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
}
