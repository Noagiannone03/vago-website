import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export const StatCard = ({ title, value, icon, color, trend, loading }: StatCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          backgroundColor: color || 'primary.main',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                backgroundColor: color ? `${color}15` : 'primary.light',
                color: color || 'primary.main',
                p: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {value}
            </Typography>

            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs dernier mois
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
