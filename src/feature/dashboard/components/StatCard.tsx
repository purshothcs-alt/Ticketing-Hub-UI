
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  isLoading = false,
}) => {
  const getColorValue = (colorName: string) => {
    const colorMap = {
      primary: '#8B5CF6',
      secondary: '#34D399',
      info: '#3B82F6',
      warning: '#FBBF24',
      error: '#FB7185',
      success: '#22C55E',
    };
    return colorMap[colorName as keyof typeof colorMap] || colorMap.primary;
  };

  if (isLoading) {
    return (
      <Card 
        sx={{ 
          height: '100%',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 20, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
              <Box sx={{ height: 32, bgcolor: 'grey.200', borderRadius: 1, mb: 1, width: '60%' }} />
              <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: '40%' }} />
            </Box>
            <Avatar sx={{ bgcolor: 'grey.200', width: 56, height: 56 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${getColorValue(color)}20 0%, ${getColorValue(color)}10 100%)`,
        border: `1px solid ${getColorValue(color)}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${getColorValue(color)}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: getColorValue(color),
                mb: 0.5,
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend.isPositive ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          
          <Avatar
            sx={{
              bgcolor: getColorValue(color),
              width: 56,
              height: 56,
              boxShadow: `0 8px 16px ${getColorValue(color)}30`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};