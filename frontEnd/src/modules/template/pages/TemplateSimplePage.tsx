import { useState } from 'react'
import { PageLayout } from '@/shared/components'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  Button,
  Alert,
} from '@mui/material'
import { Save as SaveIcon, Undo as UndoIcon } from '@mui/icons-material'

export function TemplateSimplePage() {
  const { t } = useTranslation()
  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('https://admin.example.com')
  const [enableNotification, setEnableNotification] = useState(true)
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)
  const [enableLog, setEnableLog] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('30')

  return (
    <PageLayout
      variant="simple"
      title={t('template.systemSettings')}
      subtitle={t('template.systemSettingsSubtitle')}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 720 }}>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{t('template.basicSettings')}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label={t('template.siteName')}
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label={t('template.siteUrl')}
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ minWidth: 80 }}>{t('template.sessionTimeout')}</Typography>
              <Select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              >
                <MenuItem value="15">{t('template.timeout.15min')}</MenuItem>
                <MenuItem value="30">{t('template.timeout.30min')}</MenuItem>
                <MenuItem value="60">{t('template.timeout.1hour')}</MenuItem>
                <MenuItem value="120">{t('template.timeout.2hours')}</MenuItem>
              </Select>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{t('template.securitySettings')}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={enableNotification}
                  onChange={(e) => setEnableNotification(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('template.enableNotification')}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('template.enableNotificationDesc')}</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={enableTwoFactor}
                  onChange={(e) => setEnableTwoFactor(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('template.twoFactorAuth')}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('template.twoFactorAuthDesc')}</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={enableLog}
                  onChange={(e) => setEnableLog(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('template.operationLog')}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('template.operationLogDesc')}</Typography>
                </Box>
              }
            />
          </Box>
        </Paper>

        <Alert severity="info" sx={{ borderRadius: 2 }}>
          {t('template.settingsNote')}
        </Alert>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" startIcon={<SaveIcon />}>
            {t('template.saveSettings')}
          </Button>
          <Button variant="outlined" startIcon={<UndoIcon />}>
            {t('template.reset')}
          </Button>
        </Box>
      </Box>
    </PageLayout>
  )
}
