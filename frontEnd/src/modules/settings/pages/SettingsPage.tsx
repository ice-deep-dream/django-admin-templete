import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stack,
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'
import { PageLayout } from '@/shared/components'
import type { ActionButton } from '@/shared/components'

export function SettingsPage() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState({
    siteName: 'Django Admin System',
    siteUrl: 'https://example.com',
    timezone: 'Asia/Shanghai',
    emailNotifications: true,
    twoFactorAuth: false,
    darkMode: false,
    compactMode: false,
  })

  const handleSave = () => {
    alert(t('settings.settingsSaved'))
  }

  const actions: ActionButton[] = [
    {
      label: t('settings.saveSettings'),
      onClick: handleSave,
      variant: 'contained',
      startIcon: <SaveIcon />,
    },
  ]

  return (
    <PageLayout
      variant="action"
      title={t('settings.title')}
      subtitle={t('settings.subtitle')}
      actions={actions}
    >

      <Stack spacing={3}>
        <Alert severity="info" variant="outlined">
          {t('settings.demoModeNote')}
        </Alert>

        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {t('settings.basicSettings')}
          </Typography>
          <Stack spacing={3}>
            <TextField
              label={t('settings.systemName')}
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('settings.systemUrl')}
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 3 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>{t('settings.timezone')}</InputLabel>
                <Select
                  value={settings.timezone}
                  label={t('settings.timezone')}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <MenuItem value="Asia/Shanghai">{t('settings.tz.shanghai')}</MenuItem>
                  <MenuItem value="America/New_York">{t('settings.tz.newYork')}</MenuItem>
                  <MenuItem value="Europe/London">{t('settings.tz.london')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {t('settings.notificationSettings')}
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                />
              }
              label={t('settings.enableEmailNotifications')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                />
              }
              label={t('settings.enableTwoFactorAuth')}
            />
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {t('settings.interfaceSettings')}
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                />
              }
              label={t('settings.darkMode')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.compactMode}
                  onChange={(e) => setSettings({ ...settings, compactMode: e.target.checked })}
                />
              }
              label={t('settings.compactLayout')}
            />
          </Stack>
        </Paper>

      </Stack>
    </PageLayout>
  )
}
