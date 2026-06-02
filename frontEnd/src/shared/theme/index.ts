import { createTheme } from '@mui/material/styles'
import type { ThemeColor } from '@/shared/stores/themeColorStore'
import { COLOR_PRESETS } from '@/shared/stores/themeColorStore'

function createAppTheme(mode: 'light' | 'dark', color: ThemeColor) {
  const preset = COLOR_PRESETS[color]
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: preset.main,
        light: preset.light,
        dark: preset.dark,
        contrastText: preset.contrastText,
      },
      secondary: {
        main: isDark ? '#a78bfa' : '#7c3aed',
        light: isDark ? '#c4b5fd' : '#8b5cf6',
        dark: isDark ? '#8b5cf6' : '#6d28d9',
      },
      background: {
        default: isDark ? '#0c1222' : '#f0f2f5',
        paper: isDark ? '#151d2e' : '#ffffff',
      },
      divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      text: {
        primary: isDark ? '#e8eaf0' : '#1a1a2e',
        secondary: isDark ? '#8892a4' : '#6b7280',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
    },
    typography: {
      fontFamily: '"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' },
      h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontSize: '1.125rem', fontWeight: 600 },
      h5: { fontSize: '1rem', fontWeight: 600 },
      h6: { fontSize: '0.875rem', fontWeight: 600 },
      body1: { fontSize: '0.875rem', lineHeight: 1.6 },
      body2: { fontSize: '0.75rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: { borderRadius: 10 },
    shadows: isDark
      ? [
          'none',
          '0 1px 2px rgba(0,0,0,0.3)',
          '0 2px 8px rgba(0,0,0,0.4)',
          '0 4px 12px rgba(0,0,0,0.5)',
          '0 8px 24px rgba(0,0,0,0.5)',
          '0 12px 32px rgba(0,0,0,0.6)',
          '0 16px 48px rgba(0,0,0,0.6)',
          '0 20px 56px rgba(0,0,0,0.7)',
          '0 24px 64px rgba(0,0,0,0.7)',
          '0 28px 72px rgba(0,0,0,0.7)',
          '0 32px 80px rgba(0,0,0,0.8)',
          '0 36px 88px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
          '0 40px 96px rgba(0,0,0,0.8)',
        ] as const
      : [
          'none',
          '0 1px 2px rgba(0,0,0,0.04)',
          '0 2px 8px rgba(0,0,0,0.06)',
          '0 4px 12px rgba(0,0,0,0.08)',
          '0 8px 24px rgba(0,0,0,0.08)',
          '0 12px 32px rgba(0,0,0,0.1)',
          '0 16px 48px rgba(0,0,0,0.1)',
          '0 20px 56px rgba(0,0,0,0.12)',
          '0 24px 64px rgba(0,0,0,0.12)',
          '0 28px 72px rgba(0,0,0,0.14)',
          '0 32px 80px rgba(0,0,0,0.14)',
          '0 36px 88px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
          '0 40px 96px rgba(0,0,0,0.16)',
        ] as const,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: 6,
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)'
              : '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          outlined: {
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.3)'
              : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
            padding: '6px 16px',
            fontSize: '0.8125rem',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 4px 12px ${preset.main}30`,
            },
          },
          outlined: {
            borderWidth: 1,
            '&:hover': {
              borderWidth: 1,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            fontSize: '0.6875rem',
          },
          sizeSmall: {
            height: 22,
            fontSize: '0.625rem',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
            fontSize: '0.8125rem',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.75rem',
            color: isDark ? '#8892a4' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.6)'
              : '0 24px 64px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                boxShadow: isDark
                  ? '0 0 0 1px rgba(255,255,255,0.08)'
                  : '0 0 0 1px rgba(0,0,0,0.08)',
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${preset.main}18`,
              },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8125rem',
            minWidth: 'auto',
            padding: '8px 16px',
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            borderRadius: '3px 3px 0 0',
            height: 3,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.75rem',
            padding: '6px 12px',
            boxShadow: isDark
              ? '0 4px 12px rgba(0,0,0,0.5)'
              : '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.5)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            margin: '2px 4px',
            padding: '6px 12px',
            fontSize: '0.8125rem',
            transition: 'all 0.15s ease',
          },
        },
      },
    },
  })
}

export const lightTheme = (color: ThemeColor = 'indigo') => createAppTheme('light', color)
export const darkTheme = (color: ThemeColor = 'indigo') => createAppTheme('dark', color)
