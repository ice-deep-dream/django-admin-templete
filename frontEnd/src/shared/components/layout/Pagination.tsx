import { Box, Typography, IconButton, useMediaQuery, useTheme, Select, MenuItem, type SelectChangeEvent, Slider } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

export interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  if (isMobile) {
    return <MobilePagination
      page={page}
      totalPages={totalPages}
      startItem={startItem}
      endItem={endItem}
      totalItems={totalItems}
      onPageChange={onPageChange}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={onPageSizeChange}
    />
  }

  return (
    <DesktopPagination
      page={page}
      totalPages={totalPages}
      startItem={startItem}
      endItem={endItem}
      totalItems={totalItems}
      onPageChange={onPageChange}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={onPageSizeChange}
    />
  )
}

function DesktopPagination({
  page,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
}: PaginationProps & { startItem: number; endItem: number }) {
  const pages = getVisiblePages(page, totalPages)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
          {`${startItem}-${endItem} / 共 ${totalItems} 条`}
        </Typography>
        {onPageSizeChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              每页
            </Typography>
            <Select
              value={pageSize}
              size="small"
              sx={{ minWidth: 60, fontSize: '0.8125rem', height: 32 }}
              onChange={(e: SelectChangeEvent<number>) => onPageSizeChange(e.target.value as number)}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size} sx={{ fontSize: '0.8125rem' }}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          sx={{ p: 0.5 }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>

        {pages.map((p, idx) =>
          p === -1 ? (
            <Typography
              key={`ellipsis-${idx}`}
              sx={{ px: 0.5, color: 'text.disabled', fontSize: '0.8125rem' }}
            >
              ...
            </Typography>
          ) : (
            <IconButton
              key={p}
              size="small"
              onClick={() => onPageChange(p)}
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8125rem',
                fontWeight: page === p ? 600 : 400,
                bgcolor: page === p ? 'primary.main' : 'transparent',
                color: page === p ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: page === p ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              {p}
            </IconButton>
          ),
        )}

        <IconButton
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          sx={{ p: 0.5 }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}

function MobilePagination({
  page,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
}: PaginationProps & { startItem: number; endItem: number }) {

  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {`${startItem}-${endItem} / 共 ${totalItems} 条`}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
          {`第 ${page} / ${totalPages} 页`}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
            '&.Mui-disabled': { bgcolor: 'transparent' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Slider
          value={page}
          min={1}
          max={totalPages}
          onChange={(_, v) => onPageChange(v as number)}
          size="small"
          sx={{
            flexGrow: 1,
            height: 4,
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
            },
          }}
        />

        <IconButton
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
            '&.Mui-disabled': { bgcolor: 'transparent' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {onPageSizeChange && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mr: 1 }}>
            每页
          </Typography>
          <Select
            value={pageSize}
            size="small"
            sx={{ minWidth: 60, fontSize: '0.75rem', height: 28 }}
            onChange={(e: SelectChangeEvent<number>) => onPageSizeChange(e.target.value as number)}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size} sx={{ fontSize: '0.75rem' }}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  )
}

function getVisiblePages(current: number, total: number): (number | -1)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, 4, -1, total]
  if (current >= total - 2) return [1, -1, total - 3, total - 2, total - 1, total]
  return [1, -1, current - 1, current, current + 1, -1, total]
}
