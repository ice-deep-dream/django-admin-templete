import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeColor = 'indigo' | 'blue' | 'emerald' | 'violet' | 'rose' | 'amber'

export interface ColorPreset {
  name: string
  main: string
  light: string
  dark: string
  contrastText: string
}

export const COLOR_PRESETS: Record<ThemeColor, ColorPreset> = {
  indigo: {
    name: '靛蓝',
    main: '#4f46e5',
    light: '#6366f1',
    dark: '#4338ca',
    contrastText: '#ffffff',
  },
  blue: {
    name: '蓝色',
    main: '#2563eb',
    light: '#3b82f6',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  emerald: {
    name: '翠绿',
    main: '#059669',
    light: '#10b981',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  violet: {
    name: '紫罗兰',
    main: '#7c3aed',
    light: '#8b5cf6',
    dark: '#6d28d9',
    contrastText: '#ffffff',
  },
  rose: {
    name: '玫红',
    main: '#e11d48',
    light: '#f43f5e',
    dark: '#be123c',
    contrastText: '#ffffff',
  },
  amber: {
    name: '琥珀',
    main: '#d97706',
    light: '#f59e0b',
    dark: '#b45309',
    contrastText: '#ffffff',
  },
}

interface ThemeColorState {
  color: ThemeColor
  setColor: (color: ThemeColor) => void
}

export const useThemeColorStore = create<ThemeColorState>()(
  persist(
    (set) => ({
      color: 'indigo',
      setColor: (color) => set({ color }),
    }),
    {
      name: 'theme-color-storage',
    },
  ),
)
