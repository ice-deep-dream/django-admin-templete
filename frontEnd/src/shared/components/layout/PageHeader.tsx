import type { ReactNode } from 'react'
import { Box, Typography, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material'

interface TabItem {
  label: string
  value: string | number
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  tabs?: TabItem[]
  activeTab?: string | number
  onTabChange?: (value: string | number) => void
}

export function PageHeader({ title, subtitle, actions, tabs, activeTab, onTabChange }: PageHeaderProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexShrink: 0,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-end', sm: 'flex-start' },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>

      {tabs && tabs.length > 0 && (
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 0 }}>
          <Tabs
            value={activeTab ?? tabs[0].value}
            onChange={(_, v) => onTabChange?.(v)}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                px: { xs: 2, sm: 3 },
              },
            }}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
      )}

      <Box
        sx={{
          height: 1,
          background: `linear-gradient(to right, ${theme.palette.primary.main}20, ${theme.palette.primary.main}00)`,
          mt: tabs && tabs.length > 0 ? 0 : 0,
        }}
      />
    </Box>
  )
}
