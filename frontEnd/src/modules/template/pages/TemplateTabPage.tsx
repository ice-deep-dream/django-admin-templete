import { useState } from 'react'
import { PageLayout } from '@/shared/components'
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
import { EditOutlined as EditIcon, DeleteOutlined as DeleteIcon, Shield as ShieldIcon } from '@mui/icons-material'

const mockRoles = [
  { name: 'template.roles.admin', code: 'admin', users: 2, permissions: 28, description: 'template.roleDesc.admin' },
  { name: 'template.roles.manager', code: 'manager', users: 5, permissions: 20, description: 'template.roleDesc.manager' },
  { name: 'template.roles.seniorEditor', code: 'senior_editor', users: 3, permissions: 15, description: 'template.roleDesc.seniorEditor' },
  { name: 'template.roles.editor', code: 'editor', users: 8, permissions: 12, description: 'template.roleDesc.editor' },
  { name: 'template.roles.reviewer', code: 'reviewer', users: 4, permissions: 8, description: 'template.roleDesc.reviewer' },
  { name: 'template.roles.analyst', code: 'analyst', users: 6, permissions: 10, description: 'template.roleDesc.analyst' },
  { name: 'template.roles.support', code: 'support', users: 12, permissions: 6, description: 'template.roleDesc.support' },
  { name: 'template.roles.viewer', code: 'viewer', users: 20, permissions: 3, description: 'template.roleDesc.viewer' },
]

const mockPermissions = [
  { name: 'template.perm.viewUser', code: 'user:view', module: 'template.modules.userMgmt' },
  { name: 'template.perm.createUser', code: 'user:create', module: 'template.modules.userMgmt' },
  { name: 'template.perm.editUser', code: 'user:edit', module: 'template.modules.userMgmt' },
  { name: 'template.perm.deleteUser', code: 'user:delete', module: 'template.modules.userMgmt' },
  { name: 'template.perm.viewRole', code: 'role:view', module: 'template.modules.roleMgmt' },
  { name: 'template.perm.createRole', code: 'role:create', module: 'template.modules.roleMgmt' },
  { name: 'template.perm.editRole', code: 'role:edit', module: 'template.modules.roleMgmt' },
  { name: 'template.perm.deleteRole', code: 'role:delete', module: 'template.modules.roleMgmt' },
  { name: 'template.perm.viewOrder', code: 'order:view', module: 'template.modules.orderMgmt' },
  { name: 'template.perm.createOrder', code: 'order:create', module: 'template.modules.orderMgmt' },
  { name: 'template.perm.editOrder', code: 'order:edit', module: 'template.modules.orderMgmt' },
  { name: 'template.perm.exportOrder', code: 'order:export', module: 'template.modules.orderMgmt' },
  { name: 'template.perm.viewReport', code: 'report:view', module: 'template.modules.reportCenter' },
  { name: 'template.perm.exportReport', code: 'report:export', module: 'template.modules.reportCenter' },
  { name: 'template.perm.systemConfig', code: 'system:config', module: 'template.modules.systemMgmt' },
  { name: 'template.perm.systemLog', code: 'system:log', module: 'template.modules.systemMgmt' },
]

const mockUserRoles = [
  { name: 'Alice', role: 'template.roles.admin', email: 'alice@email.com', department: 'template.dept.tech' },
  { name: 'Bob', role: 'template.roles.editor', email: 'bob@email.com', department: 'template.dept.content' },
  { name: 'Charlie', role: 'template.roles.viewer', email: 'charlie@email.com', department: 'template.dept.marketing' },
  { name: 'Diana', role: 'template.roles.manager', email: 'diana@email.com', department: 'template.dept.operations' },
  { name: 'Edward', role: 'template.roles.seniorEditor', email: 'edward@email.com', department: 'template.dept.content' },
  { name: 'Fiona', role: 'template.roles.support', email: 'fiona@email.com', department: 'template.dept.support' },
  { name: 'George', role: 'template.roles.analyst', email: 'george@email.com', department: 'template.dept.data' },
  { name: 'Helen', role: 'template.roles.reviewer', email: 'helen@email.com', department: 'template.dept.content' },
]

const avatarColors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#7b1fa2']

export function TemplateTabPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string | number>(0)

  return (
    <PageLayout
      variant="tab"
      title={t('template.rolePermissionTitle')}
      subtitle={t('template.rolePermissionSubtitle')}
      tabs={[
        { label: t('template.tabs.roleManagement'), value: 0 },
        { label: t('template.tabs.permissionDictionary'), value: 1 },
        { label: t('template.tabs.userAssociation'), value: 2 },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
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
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              {activeTab === 0 && (
                <>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.role')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.permissionCount')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.userCount')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.description')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="right">{t('common.actions')}</TableCell>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.permissionName')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.permissionCode')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.module')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="right">{t('common.actions')}</TableCell>
                </>
              )}
              {activeTab === 2 && (
                <>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.user')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.role')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('template.department')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }} align="right">{t('common.actions')}</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {activeTab === 0 && mockRoles.map((row, index) => {
              const colorIndex = index % avatarColors.length
              return (
                <TableRow
                  key={row.code}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', fontWeight: 600, bgcolor: avatarColors[colorIndex] }}>
                        {t(row.name).charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>{t(row.name)}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', lineHeight: 1.2 }}>{row.code}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ShieldIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{row.permissions}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={t('template.peopleCount', { count: row.users })} size="small" sx={{ fontWeight: 500, fontSize: '0.6875rem' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{t(row.description)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title={t('common.edit')}><IconButton size="small" color="inherit"><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title={t('common.delete')}><IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
            {activeTab === 1 && mockPermissions.map((row) => (
              <TableRow
                key={row.code}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{t(row.name)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'text.secondary' }}>{row.code}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={t(row.module)} size="small" variant="outlined" sx={{ fontSize: '0.6875rem' }} />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Tooltip title={t('common.edit')}><IconButton size="small" color="inherit"><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title={t('common.delete')}><IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {activeTab === 2 && mockUserRoles.map((row, index) => {
              const colorIndex = index % avatarColors.length
              return (
                <TableRow
                  key={row.name}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', fontWeight: 600, bgcolor: avatarColors[colorIndex] }}>
                        {row.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>{row.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={t(row.role)} size="small" sx={{ fontWeight: 500, fontSize: '0.6875rem' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{t(row.department)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title={t('common.edit')}><IconButton size="small" color="inherit"><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title={t('common.delete')}><IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
