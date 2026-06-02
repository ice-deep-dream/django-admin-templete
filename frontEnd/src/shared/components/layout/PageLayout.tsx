import type { ReactNode } from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  alpha,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'


// ==================== 类型定义 ====================

export type PageLayoutVariant = 'tab' | 'simple' | 'action' | 'search' | 'stats'

export interface TabItem {
  label: string
  value: string | number
  icon?: ReactNode
}

export interface ActionButton {
  label: string
  onClick: () => void
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  startIcon?: ReactNode
  disabled?: boolean
}

export interface SearchConfig {
  placeholder?: string
  onSearch: (value: string) => void
  defaultValue?: string
}

export interface StatItem {
  label: string
  value: string | number
  icon?: ReactNode
  color?: string
  trend?: {
    value: number
    positive: boolean
  }
}

export interface PageLayoutProps {
  // 基础配置
  variant?: PageLayoutVariant
  title: string
  subtitle?: string
  
  // Tab 布局配置
  tabs?: TabItem[]
  activeTab?: string | number
  onTabChange?: (value: string | number) => void
  
  // 按钮布局配置
  actions?: ActionButton[] | ReactNode
  
  // 搜索布局配置
  search?: SearchConfig
  
  // 统计布局配置
  stats?: StatItem[]
  
  // 内容区
  children: ReactNode
  
  // 固定头部（使用 sticky 定位）
  sticky?: boolean
}

// ==================== 布局组件 ====================

function StickyWrapper({ children, sticky = true }: { children: ReactNode; sticky?: boolean }) {
  if (!sticky) return <>{children}</>
  
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: (t) => alpha(t.palette.background.default, 0.85),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {children}
    </Box>
  )
}

function TabHeader({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
}: {
  title: string
  subtitle?: string
  tabs: TabItem[]
  activeTab?: string | number
  onTabChange?: (value: string | number) => void
}) {
  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <Paper sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2 }}>
        <Tabs
          value={activeTab ?? tabs[0].value}
          onChange={(_, v) => onTabChange?.(v)}
          sx={{
            px: 2,
            minHeight: 44,
            '& .MuiTab-root': { minHeight: 44, fontWeight: 500, fontSize: '0.8125rem', px: 3 },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Paper>
    </Box>
  )
}

function SimpleHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

function ActionHeader({
  title,
  subtitle,
  actions,
  buttons,
}: {
  title: string
  subtitle?: string
  actions: ActionButton[]
  buttons?: ReactNode
}) {
  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {buttons ? (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{buttons}</Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                onClick={action.onClick}
                startIcon={action.startIcon}
                disabled={action.disabled}
                size="small"
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function SearchHeader({
  title,
  subtitle,
  search,
  actions,
  customActions,
}: {
  title: string
  subtitle?: string
  search: SearchConfig
  actions?: ActionButton[]
  customActions?: ReactNode
}) {
  const [searchValue, setSearchValue] = useState(search.defaultValue || '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearch = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      search.onSearch(value)
    }, 300)
  }, [search])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleChange = (value: string) => {
    setSearchValue(value)
    debouncedSearch(value)
  }

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {customActions ? (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{customActions}</Box>
        ) : actions && actions.length > 0 ? (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                onClick={action.onClick}
                startIcon={action.startIcon}
                disabled={action.disabled}
                size="small"
              >
                {action.label}
              </Button>
            ))}
          </Box>
        ) : null}
      </Box>
      <TextField
        fullWidth
        size="small"
        placeholder={search.placeholder || '搜索...'}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          maxWidth: 400,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
          },
        }}
      />
    </Box>
  )
}

function StatsHeader({
  title,
  subtitle,
  stats,
}: {
  title: string
  subtitle?: string
  stats: StatItem[]
}) {
  const theme = useTheme()

  const gradientPairs: Record<string, [string, string]> = {
    primary: [theme.palette.primary.main, theme.palette.primary.light],
    success: ['#059669', '#34d399'],
    info: ['#2563eb', '#60a5fa'],
    warning: ['#d97706', '#fbbf24'],
    error: ['#dc2626', '#f87171'],
    secondary: [theme.palette.secondary.main, theme.palette.secondary.light],
  }

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
        {stats.map((stat, index) => {
          const colors = gradientPairs[stat.color || 'primary'] || gradientPairs.primary
          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 0,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(colors[0], 0.15)}`,
                },
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '60%',
                    height: '200%',
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'rotate(15deg)',
                    pointerEvents: 'none',
                  },
                }}
              >
                {stat.icon && (
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      flexShrink: 0,
                      '& svg': {
                        fontSize: '1.25rem',
                      },
                    }}
                  >
                    {stat.icon}
                  </Box>
                )}
                <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.3, color: 'white', letterSpacing: '-0.02em' }}>
                    {stat.value}
                  </Typography>
                  {stat.trend && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.25,
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 600,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        px: 0.75,
                        py: 0.125,
                        borderRadius: 1,
                        fontSize: '0.625rem',
                      }}
                    >
                      {stat.trend.positive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          )
        })}
      </Box>
    </Box>
  )
}

// ==================== 主组件 ====================

export function PageLayout({
  variant = 'simple',
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  actions,
  search,
  stats,
  children,
  sticky = true,
}: PageLayoutProps) {
  const renderHeader = () => {
    switch (variant) {
      case 'tab':
        if (!tabs || tabs.length === 0) {
          console.warn('PageLayout: tab variant requires tabs prop')
          return <SimpleHeader title={title} subtitle={subtitle} />
        }
        return (
          <TabHeader
            title={title}
            subtitle={subtitle}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )
      case 'simple':
        return <SimpleHeader title={title} subtitle={subtitle} />
      case 'action':
        if (!actions || (Array.isArray(actions) && actions.length === 0)) {
          console.warn('PageLayout: action variant requires actions prop')
          return <SimpleHeader title={title} subtitle={subtitle} />
        }
        return Array.isArray(actions) ? (
          <ActionHeader title={title} subtitle={subtitle} actions={actions} />
        ) : (
          <ActionHeader title={title} subtitle={subtitle} actions={[]} buttons={actions} />
        )
      case 'search':
        if (!search) {
          console.warn('PageLayout: search variant requires search prop')
          return <SimpleHeader title={title} subtitle={subtitle} />
        }
        return <SearchHeader title={title} subtitle={subtitle} search={search} actions={Array.isArray(actions) ? actions : undefined} customActions={!Array.isArray(actions) ? actions : undefined} />
      case 'stats':
        if (!stats || stats.length === 0) {
          console.warn('PageLayout: stats variant requires stats prop')
          return <SimpleHeader title={title} subtitle={subtitle} />
        }
        return <StatsHeader title={title} subtitle={subtitle} stats={stats} />
      default:
        return <SimpleHeader title={title} subtitle={subtitle} />
    }
  }

  return (
    <Box>
      <StickyWrapper sticky={sticky}>
        {renderHeader()}
      </StickyWrapper>

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {children}
      </Box>
    </Box>
  )
}
