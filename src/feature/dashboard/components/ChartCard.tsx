import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

interface StatusOrPriority {
  statusName?: string;
  priorityName?: string;
  count: number;
}

interface TicketTrend {
  date: string;
  created: number;
  resolved: number;
  open: number;
}

interface ChartCardProps {
  title: string;
  type: 'pie' | 'bar' | 'line';
  data: StatusOrPriority[] | TicketTrend[];
  height?: number;
  isLoading?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  height = 300,
  isLoading = false,
}) => {

  const transformData = () => {
    if (type === 'pie' || type === 'bar') {
      return (data as StatusOrPriority[]).map((item, index) => ({
        name: item.statusName || item.priorityName || 'N/A',
        value: item.count,
        color: `hsl(${index * 45}, 70%, 60%)`
      }));
    }
    // For line chart, return as-is
    return data as TicketTrend[];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 1,
            boxShadow: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {label && (
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          )}
          {payload.map((pld: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: pld.color,
                }}
              />
              <Typography variant="body2">
                {pld.name}: {pld.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Loading chart...
          </Typography>
        </Box>
      );
    }

    const transformedData = transformData();

    if (type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={transformedData as any}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={false}
            >
              {(transformedData as any).map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ReTooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <ReTooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={transformedData as TicketTrend[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <ReTooltip content={<CustomTooltip />} labelFormatter={(value) => new Date(value).toLocaleDateString()} />
            <Line type="monotone" dataKey="created" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} name="Created" />
            <Line type="monotone" dataKey="resolved" stroke="#34D399" strokeWidth={3} dot={{ fill: '#34D399', r: 4 }} name="Resolved" />
            <Line type="monotone" dataKey="open" stroke="#FB7185" strokeWidth={3} dot={{ fill: '#FB7185', r: 4 }} name="Open" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent sx={{ pt: 0 }}>{renderChart()}</CardContent>
    </Card>
  );
};
