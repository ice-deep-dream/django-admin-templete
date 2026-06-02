import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
} from '@mui/icons-material'
import { useAuthStore } from '@/shared/stores'
import { authApi } from '@/shared/api/auth'
import apiClient from '@/shared/api/client'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const theme = useTheme()

  const fetchCaptcha = async () => {
    try {
      const res = await apiClient.get('/auth/captcha/', { responseType: 'blob' })
      const token = (res.headers as Record<string, string>)['x-captcha-token'] || ''
      setCaptchaToken(token)
      const url = URL.createObjectURL(res.data as Blob)
      setCaptchaImage(url)
    } catch {
      setError('验证码加载失败，请刷新页面重试')
    }
  }

  useEffect(() => {
    fetchCaptcha()
    return () => {
      if (captchaImage) URL.revokeObjectURL(captchaImage)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await authApi.login(username, password, captchaToken, captchaCode)
      login(
        {
          id: res.data.user.id,
          username: res.data.user.username,
          email: res.data.user.email,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
          is_staff: res.data.user.is_staff,
          is_superuser: res.data.user.is_superuser,
        },
        res.data.access,
        res.data.refresh,
      )
      navigate('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登录失败，请检查用户名和密码'
      setError(message)
      fetchCaptcha()
      setCaptchaCode('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 左侧：背景图 */}
      <Box
        sx={{
          flex: 3,
          position: 'relative',
          display: { xs: 'none', md: 'block' },
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          component="img"
          src="/bg.png"
          alt=""
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            right: 48,
            zIndex: 2,
            color: 'white',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              mb: 1,
            }}
          >
            Django Admin
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.85,
              textShadow: '0 1px 6px rgba(0,0,0,0.3)',
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            高效、安全的企业级后台管理系统，助力团队快速构建业务应用
          </Typography>
        </Box>
      </Box>

      {/* 右侧：登录表单 */}
      <Box
        sx={{
          flex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          position: 'relative',
          px: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* 移动端 Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mb: 4, gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlined sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Django Admin
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            欢迎回来
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            请登录您的账户以继续
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="用户名"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              fullWidth
              required
              autoComplete="username"
            />

            <TextField
              label="密码"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 验证码 */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <TextField
                label="验证码"
                value={captchaCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCaptchaCode(e.target.value.toUpperCase())}
                autoComplete="off"
                placeholder="请输入验证码"
                slotProps={{
                  input: {
                    inputProps: { maxLength: 4, style: { textTransform: 'uppercase', letterSpacing: '0.15em' } },
                  },
                }}
                sx={{ flex: 1 }}
              />
              <Tooltip title="刷新验证码">
                <IconButton
                  onClick={fetchCaptcha}
                  sx={{
                    width: 120,
                    height: 40,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 0,
                    overflow: 'hidden',
                    bgcolor: 'grey.50',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  {captchaImage ? (
                    <Box component="img" src={captchaImage} alt="验证码" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <CircularProgress size={20} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            {error && (
              <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.25,
                fontSize: '0.875rem',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '&:active': {
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '登录'}
            </Button>
          </Box>

          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6875rem' }}>
              Powered by Django + React
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
