import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
  InputBase,
  Stack,
  useTheme,
  Collapse,
  useMediaQuery,
  Popover,
  CircularProgress,
  alpha,
  Paper,
} from '@mui/material'
import {
  ChevronLeft as ArrowLeftIcon,
  ChevronRight as ArrowRightIcon,
  DashboardOutlined as DashboardIcon,
  PeopleOutlined as PeopleIcon,
  SettingsOutlined as SettingsIcon,
  NotificationsOutlined as NotificationsIcon,
  Search as SearchIcon,
  LogoutOutlined as LogoutIcon,
  AccountCircleOutlined,
  FolderOutlined as FolderIcon,
  LocalOfferOutlined as TagIcon,
  DescriptionOutlined as PostIcon,
  AdminPanelSettingsOutlined as AdminIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  PaletteOutlined as PaletteIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useAuthStore, useLayoutStore, useThemeStore, useThemeColorStore } from '@/shared/stores'
import { COLOR_PRESETS } from '@/shared/stores/themeColorStore'
import type { ThemeColor } from '@/shared/stores/themeColorStore'
import apiClient from '@/shared/api/client'

const DRAWER_WIDTH = 200
const DRAWER_WIDTH_COLLAPSED = 52

// 图标映射：将后端返回的图标名称映射到 MUI 图标组件
const ICON_MAP: Record<string, React.ReactNode> = {
  'DashboardIcon': <DashboardIcon />,
  'PeopleIcon': <PeopleIcon />,
  'SettingsIcon': <SettingsIcon />,
  'NotificationsIcon': <NotificationsIcon />,
  'SearchIcon': <SearchIcon />,
  'LogoutIcon': <LogoutIcon />,
  'AccountCircle': <AccountCircleOutlined />,
  'FolderIcon': <FolderIcon />,
  'TagIcon': <TagIcon />,
  'PostIcon': <PostIcon />,
  'AdminIcon': <AdminIcon />,
}

interface MenuItemType {
  id: number
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuItemType[]
}

interface MenuGroupType {
  label?: string
  items: MenuItemType[]
}

export function DashboardLayout() {
  const { t } = useTranslation()
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen)
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar)
  const setSidebarOpen = useLayoutStore((state) => state.setSidebarOpen)
  const themeMode = useThemeStore((state) => state.mode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const themeColor = useThemeColorStore((state) => state.color)
  const setThemeColor = useThemeColorStore((state) => state.setColor)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null)
  const [popoverItem, setPopoverItem] = useState<MenuItemType | null>(null)
  const [menuGroups, setMenuGroups] = useState<MenuGroupType[]>([])
  const [loading, setLoading] = useState(true)
  const [navSearch, setNavSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const SIDEBAR_AUTO_COLLAPSE_WIDTH = 900

  // 从 API 获取菜单
  useEffect(() => {
    const fetchMenu = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const res = await apiClient.get(`/menu/user_menu/?user_id=${user.id}`)
        const menuItems = res.data

        // 将后端返回的菜单数据转换为前端格式
        const convertMenuItem = (item: Record<string, unknown>): MenuItemType => ({
          id: item.id as number,
          label: t(item.label as string),
          icon: ICON_MAP[item.icon as string] || <FolderIcon />,
          path: (item.path as string) || undefined,
          children: (item.children as Record<string, unknown>[])?.map(convertMenuItem),
        })

        const groupMap = new Map<string, { items: MenuItemType[]; rawLabel: string }>()
        const noGroup: MenuItemType[] = []

        ;(menuItems as Record<string, unknown>[]).forEach((item) => {
          const menuItem = convertMenuItem(item)
          const groupLabel = item.group_label as string | undefined
          if (groupLabel) {
            if (!groupMap.has(groupLabel)) {
              groupMap.set(groupLabel, { items: [], rawLabel: groupLabel })
            }
            groupMap.get(groupLabel)!.items.push(menuItem)
          } else {
            noGroup.push(menuItem)
          }
        })

        const groups: MenuGroupType[] = []
        if (noGroup.length > 0) {
          groups.push({ items: noGroup })
        }
        groupMap.forEach(({ items, rawLabel }) => {
          groups.push({ label: t(rawLabel), items })
        })

        setMenuGroups(groups)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [user?.id, t])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < SIDEBAR_AUTO_COLLAPSE_WIDTH) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  const effectiveWidth = sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED

  const allNavItems = menuGroups.flatMap((group) =>
    group.items.flatMap((item) => {
      const items: { label: string; path: string; icon: React.ReactNode }[] = []
      if (item.path) items.push({ label: item.label, path: item.path, icon: item.icon })
      if (item.children) {
        item.children.forEach((child) => {
          if (child.path) items.push({ label: child.label, path: child.path, icon: child.icon })
        })
      }
      return items
    })
  )

  const filteredNavItems = navSearch
    ? allNavItems.filter((item) => item.label.toLowerCase().includes(navSearch.toLowerCase()))
    : []

  const handleDrawerToggle = () => {
    toggleSidebar()
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleUserMenuClose()
    navigate('/login')
  }

  const handleMenuClick = (item: MenuItemType, event?: React.MouseEvent) => {
    if (item.path) {
      navigate(item.path)
      if (isMobile && sidebarOpen) setSidebarOpen(false)
    } else if (item.children) {
      if (!sidebarOpen && event) {
        setPopoverItem(item)
        setPopoverAnchor(event.currentTarget as HTMLElement)
      } else {
        setExpandedMenu(expandedMenu === item.label ? null : item.label)
      }
    }
  }

  const handlePopoverClose = () => {
    setPopoverAnchor(null)
    setPopoverItem(null)
  }

  const isMenuActive = (item: MenuItemType): boolean => {
    if (item.path && location.pathname === item.path) return true
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path)
    }
    return false
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: (t) => t.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 50%, ${t.palette.secondary.dark} 100%)`
            : `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.primary.light} 50%, ${t.palette.secondary.main} 100%)`,
          color: 'primary.contrastText',
          borderBottom: 'none',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '48px !important',
            height: '48px',
            px: 1.5,
            justifyContent: 'space-between',
          }}
        >
          {/* 左侧：折叠按钮 + 品牌标识 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                borderRadius: 1.5,
                p: 0.5,
                color: 'inherit',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {sidebarOpen ? <ArrowLeftIcon sx={{ fontSize: 16 }} /> : <ArrowRightIcon sx={{ fontSize: 16 }} />}
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, minWidth: 0 }}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: 1.5,
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                D
              </Box>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                }}
              >
                Django Admin
              </Typography>
            </Box>
          </Box>

          {/* 中间：快速导航搜索 */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              maxWidth: 400,
              mx: 3,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                width: '100%',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:focus-within': {
                  bgcolor: 'rgba(255,255,255,0.25)',
                  borderColor: 'rgba(255,255,255,0.4)',
                  boxShadow: '0 0 0 3px rgba(255,255,255,0.1)',
                },
                '&:hover:not(:focus-within)': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  pointerEvents: 'none',
                }}
              >
                <SearchIcon sx={{ fontSize: 14 }} />
              </Box>
              <InputBase
                placeholder="搜索菜单..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                sx={{
                  py: 0.5,
                  pl: 3.5,
                  pr: 1.5,
                  width: '100%',
                  fontSize: '0.75rem',
                  lineHeight: '24px',
                  color: 'white',
                  '& input::placeholder': {
                    color: 'rgba(255,255,255,0.6)',
                    opacity: 1,
                  },
                }}
              />
            </Box>
            {navSearch && filteredNavItems.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 0.5,
                  maxHeight: 280,
                  overflow: 'auto',
                  zIndex: 9999,
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                <List sx={{ py: 0.5 }}>
                  {filteredNavItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path)
                          setNavSearch('')
                        }}
                        sx={{ py: 0.75, px: 2 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32, '& svg': { fontSize: '1rem' } }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          sx={{ '& .MuiListItemText-primary': { fontSize: '0.8125rem' } }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          {/* 右侧：头像 + 主题设置 + 通知 */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
            <Tooltip title="账户设置">
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                sx={{
                  p: 0.25,
                  borderRadius: 1.5,
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.6)',
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title="主题设置">
              <IconButton
                onClick={() => setSettingsOpen(true)}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  p: 0.5,
                  color: 'inherit',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <PaletteIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="通知">
              <IconButton
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderRadius: 1.5,
                  p: 0.5,
                  color: 'inherit',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <Badge
                  badgeContent={3}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.5rem',
                      height: 12,
                      minWidth: 12,
                      borderRadius: 6,
                      bgcolor: 'error.main',
                      border: '1.5px solid rgba(255,255,255,0.5)',
                      color: 'white',
                    },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 15 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  minWidth: 180,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {user?.username || 'Admin'}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email || 'admin@example.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleUserMenuClose(); setSettingsOpen(true) }}>
              <ListItemIcon>
                <PaletteIcon fontSize="small" />
              </ListItemIcon>
              主题设置
            </MenuItem>
            <MenuItem onClick={() => { handleUserMenuClose(); toggleTheme() }}>
              <ListItemIcon>
                {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </ListItemIcon>
              {themeMode === 'dark' ? '切换亮色模式' : '切换暗色模式'}
            </MenuItem>
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings') }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              系统设置
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              退出登录
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: effectiveWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: effectiveWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important', height: '48px' }} />
        <Box sx={{ overflow: 'auto', py: 1 }}>
          {menuGroups.map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ mb: groupIndex < menuGroups.length - 1 ? 0.5 : 0 }}>
              {sidebarOpen && group.label && (
                <Box sx={{ px: 2, py: 1.5, mt: groupIndex > 0 ? 1 : 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'text.disabled',
                    }}
                  >
                    {group.label}
                  </Typography>
                </Box>
              )}
              {groupIndex > 0 && (
                <Box sx={{ px: 1.5, py: 0.5 }}>
                  <Box sx={{ height: '1px', bgcolor: 'divider' }} />
                </Box>
              )}
              <List sx={{ px: 0.5 }}>
                {group.items.map((item) => {
                  const isActive = isMenuActive(item)
                  const isExpanded = expandedMenu === item.label
                  const hasChildren = item.children && item.children.length > 0

                  return (
                    <Box key={item.label} sx={{ mb: 0.125 }}>
                      <Tooltip title={!sidebarOpen ? item.label : ''} placement="right" arrow disableHoverListener={sidebarOpen}>
                        <ListItem disablePadding>
                          <ListItemButton
                            selected={isActive}
                            onClick={(e) => handleMenuClick(item, e)}
                            sx={{
                              minHeight: 36,
                              px: sidebarOpen ? 1 : 0,
                              py: 0.5,
                              borderRadius: 1.5,
                              mx: sidebarOpen ? 0 : 'auto',
                              width: sidebarOpen ? '100%' : 36,
                              justifyContent: sidebarOpen ? 'initial' : 'center',
                              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                              position: 'relative',
                              '&.Mui-selected': {
                                bgcolor: (t) => t.palette.mode === 'dark'
                                  ? alpha(t.palette.primary.main, 0.15)
                                  : alpha(t.palette.primary.main, 0.08),
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  left: 0,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: 3,
                                  height: '60%',
                                  borderRadius: '0 3px 3px 0',
                                  background: (t) => `linear-gradient(180deg, ${t.palette.primary.light}, ${t.palette.primary.main})`,
                                },
                                '&:hover': {
                                  bgcolor: (t) => t.palette.mode === 'dark'
                                    ? alpha(t.palette.primary.main, 0.2)
                                    : alpha(t.palette.primary.main, 0.12),
                                },
                                '& .MuiListItemIcon-root': {
                                  color: 'primary.main',
                                },
                                '& .MuiListItemText-primary': {
                                  color: 'primary.main',
                                  fontWeight: 600,
                                },
                              },
                              '&:hover:not(.Mui-selected)': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: sidebarOpen ? 1.25 : 0,
                                justifyContent: 'center',
                                color: isActive ? 'primary.main' : 'inherit',
                                transition: 'color 0.2s',
                                '& svg': {
                                  fontSize: '1.125rem',
                                },
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.label}
                              sx={{
                                display: sidebarOpen ? 'block' : 'none',
                                opacity: sidebarOpen ? 1 : 0,
                                transition: theme.transitions.create('opacity', {
                                  duration: theme.transitions.duration.shorter,
                                }),
                                '& .MuiListItemText-primary': {
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  fontSize: '0.8125rem',
                                  fontWeight: isActive ? 600 : 400,
                                  transition: 'color 0.2s',
                                },
                              }}
                            />
                            {hasChildren && sidebarOpen && (
                              <Box
                                sx={{
                                  fontSize: '0.625rem',
                                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                  color: 'text.disabled',
                                  ml: 'auto',
                                }}
                              >
                                ▶
                              </Box>
                            )}
                          </ListItemButton>
                        </ListItem>
                      </Tooltip>

                      {sidebarOpen && hasChildren && (
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box
                            sx={{
                              ml: 1.5,
                              mt: 0.25,
                              mb: 0.25,
                              pl: 1.5,
                              borderLeft: '2px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <List component="div" disablePadding>
                              {item.children!.map((child) => {
                                const isChildActive = !!(child.path && location.pathname === child.path)
                                return (
                                  <ListItemButton
                                    key={child.path}
                                    selected={isChildActive}
                                    onClick={() => {
                                      if (child.path) navigate(child.path)
                                      if (isMobile) setSidebarOpen(false)
                                    }}
                                    sx={{
                                      minHeight: 30,
                                      borderRadius: 1,
                                      py: 0.375,
                                      pl: 1.5,
                                      pr: 1,
                                      mb: 0.125,
                                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                                      '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: isChildActive ? 3 : 0,
                                        height: 16,
                                        borderRadius: '0 2px 2px 0',
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                                      },
                                      '&.Mui-selected': {
                                        bgcolor: 'action.selected',
                                        '&::before': {
                                          width: 3,
                                        },
                                        '&:hover': {
                                          bgcolor: 'action.hover',
                                        },
                                        '& .MuiListItemText-primary': {
                                          color: 'primary.main',
                                          fontWeight: 600,
                                        },
                                      },
                                      '&:hover:not(.Mui-selected)': {
                                        bgcolor: 'action.hover',
                                      },
                                    }}
                                  >
                                    <ListItemText
                                      primary={child.label}
                                      sx={{
                                        '& .MuiListItemText-primary': {
                                          fontSize: '0.75rem',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        },
                                      }}
                                    />
                                  </ListItemButton>
                                )
                              })}
                            </List>
                          </Box>
                        </Collapse>
                      )}
                    </Box>
                  )
                })}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* 主题设置侧边栏 */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 2,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              主题设置
            </Typography>
            <IconButton size="small" onClick={() => setSettingsOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* 亮色/暗色模式 */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
            显示模式
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Box
              onClick={() => useThemeStore.getState().setTheme('light')}
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 2,
                border: '2px solid',
                borderColor: themeMode === 'light' ? 'primary.main' : 'divider',
                bgcolor: themeMode === 'light' ? 'action.selected' : 'transparent',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <LightModeIcon sx={{ fontSize: 24, mb: 0.5, color: themeMode === 'light' ? 'primary.main' : 'text.secondary' }} />
              <Typography variant="caption" sx={{ display: 'block', fontWeight: themeMode === 'light' ? 600 : 400 }}>
                亮色
              </Typography>
            </Box>
            <Box
              onClick={() => useThemeStore.getState().setTheme('dark')}
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 2,
                border: '2px solid',
                borderColor: themeMode === 'dark' ? 'primary.main' : 'divider',
                bgcolor: themeMode === 'dark' ? 'action.selected' : 'transparent',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <DarkModeIcon sx={{ fontSize: 24, mb: 0.5, color: themeMode === 'dark' ? 'primary.main' : 'text.secondary' }} />
              <Typography variant="caption" sx={{ display: 'block', fontWeight: themeMode === 'dark' ? 600 : 400 }}>
                暗色
              </Typography>
            </Box>
          </Box>

          {/* 主题颜色 */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 600 }}>
            主题颜色
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
            {(Object.entries(COLOR_PRESETS) as [ThemeColor, typeof COLOR_PRESETS.indigo][]).map(([key, preset]) => (
              <Box
                key={key}
                onClick={() => setThemeColor(key)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: preset.main,
                    border: themeColor === key ? '3px solid' : '3px solid transparent',
                    borderColor: themeColor === key ? 'text.primary' : 'transparent',
                    boxShadow: themeColor === key ? `0 0 0 2px ${preset.main}40` : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {themeColor === key && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: 'white',
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.625rem',
                    fontWeight: themeColor === key ? 600 : 400,
                    color: themeColor === key ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {preset.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>

      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
        transformOrigin={{ horizontal: 'left', vertical: 'center' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            },
          },
        }}
      >
        {popoverItem?.children?.map((child) => {
          const isChildActive = !!(child.path && location.pathname === child.path)
          return (
            <MenuItem
              key={child.path}
              selected={isChildActive}
              onClick={() => {
                if (child.path) {
                  navigate(child.path)
                  handlePopoverClose()
                }
              }}
              sx={{
                fontSize: '0.8125rem',
                py: 0.75,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                },
              }}
            >
              {child.label}
            </MenuItem>
          )
        })}
      </Popover>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          bgcolor: 'background.default',
          '--sidebar-width': sidebarOpen ? `${DRAWER_WIDTH}px` : `${DRAWER_WIDTH_COLLAPSED}px`,
        } as React.CSSProperties}
      >
        <Toolbar sx={{ minHeight: '48px !important', height: '48px', flexShrink: 0 }} />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
