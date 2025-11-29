import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  FileDownload,
  Print,
  Refresh,
  TrendingUp,
  Assessment,
  Speed,
  People,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  useGetOverviewStatsQuery,
  useGetTicketTrendsQuery,
  useGetTicketPrioritiesQuery,
  useGetDepartmentPerformanceQuery,
  useGetTicketStatusesQuery,
  useGetDepartmentStatsQuery,
  type DepartmentStatsResponse,
} from "../services/reportApi";

// ----------- TYPES --------------

interface OverviewStats {
  totalTickets: number;
  resolvedTickets: number;
  resolutionRatePercent: number;
  avgResolutionHumanized: string;
  avgResolutionHours: number;
  activeAgents: number;
  message?: string;
}

interface TrendPoint {
  date: string;
  created: number;
  resolved: number;
}

interface PriorityStat {
  priorityName: string;
  ticketCount: number;
}

interface StatusStat {
  statusName: string;
  ticketCount: number;
  colorCode?: string;
}

interface DepartmentPerformance {
  id: string;
  departmentName: string;
  totalTickets: number;
  resolvedTickets: number;
  resolutionRate: number;
  avgResolutionHours?: number;
}

interface DepartmentResponse {
  departments: DepartmentPerformance[];
  message: string;
}

interface PriorityResponse {
  priorities: PriorityStat[];
  message: string;
}

interface TrendResponse {
  trends: { date: string; created: number; resolved: number }[];
  message: string;
}

interface StatusResponse {
  statuses: StatusStat[];
  message: string;
}

// ----------- COMPONENTS -------------

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
    <Stack direction="row" justifyContent="space-between">
      <Box>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, color, mt: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <Icon sx={{ fontSize: 32, color, opacity: 0.8 }} />
    </Stack>
  </Paper>
);

// ----------- MAIN PAGE -------------

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: null as Date | null,
    end: null as Date | null,
  });
  const [reportType, setReportType] = useState("overview");
  const [department, setDepartment] = useState("all");

  const startIso = dateRange.start?.toISOString();
  const endIso = dateRange.end?.toISOString();
  const departmentId = department === "all" ? undefined : department;

  // API Hooks
  const {
    data: overview,
    isLoading: l1,
    error: e1,
    refetch: r1,
  } = useGetOverviewStatsQuery({
    startDate: startIso,
    endDate: endIso,
    departmentId,
  }) as {
    data?: OverviewStats;
    isLoading: boolean;
    error?: any;
    refetch: () => void;
  };

  const {
    data: trendsData,
    isLoading: l2,
    error: e2,
    refetch: r2,
  } = useGetTicketTrendsQuery({
    startDate: startIso,
    endDate: endIso,
    departmentId,
  }) as {
    data?: TrendResponse;
    isLoading: boolean;
    error?: any;
    refetch: () => void;
  };

  const {
    data: prioritiesData,
    isLoading: l3,
    error: e3,
    refetch: r3,
  } = useGetTicketPrioritiesQuery({
    startDate: startIso,
    endDate: endIso,
    departmentId,
  }) as {
    data?: PriorityResponse;
    isLoading: boolean;
    error?: any;
    refetch: () => void;
  };

  const {
    data: departmentsData,
    isLoading: l4,
    error: e4,
    refetch: r4,
  } = useGetDepartmentPerformanceQuery({
    startDate: startIso,
    endDate: endIso,
  }) as {
    data?: DepartmentResponse;
    isLoading: boolean;
    error?: any;
    refetch: () => void;
  };

  const {
    data: statusesData,
    isLoading: l5,
    error: e5,
    refetch: r5,
  } = useGetTicketStatusesQuery({
    startDate: startIso,
    endDate: endIso,
    departmentId,
  }) as {
    data?: StatusResponse;
    isLoading: boolean;
    error?: any;
    refetch: () => void;
  };
  const { data: deptStatsData } = useGetDepartmentStatsQuery({
    startDate: startIso,
    endDate: endIso,
  }) as { data?: DepartmentStatsResponse };

  const isAnyLoading = l1 || l2 || l3 || l4 || l5;
  const anyError = e1 || e2 || e3 || e4 || e5;
  const FALLBACK_COLORS = [
    "#8B5CF6",
    "#3B82F6",
    "#FBBF24",
    "#34D399",
    "#9CA3AF",
  ];

  // Status Pie Chart Data
  const statusesChart = useMemo(() => {
    return (
      statusesData?.statuses?.map((s, i) => ({
        name: s.statusName,
        value: s.ticketCount,
        color: FALLBACK_COLORS[i % FALLBACK_COLORS.length], // ✅ manually assign UI colors
      })) || []
    );
  }, [statusesData]);

  // Priorities Bar Chart Data
  const prioritiesChart = useMemo(() => {
    return (
      prioritiesData?.priorities?.map((p) => ({
        name: p.priorityName,
        count: p.ticketCount,
      })) || []
    );
  }, [prioritiesData]);

  // Trends Line Chart Data (Weekday names)
  const chartTrends = useMemo(() => {
    return (
      trendsData?.trends?.map((t) => {
        const d = new Date(t.date);
        return {
          date: d.toLocaleDateString(undefined, { weekday: "short" }),
          created: t.created,
          resolved: t.resolved,
        };
      }) || []
    );
  }, [trendsData]);

  // Department Chart Data with avg hours axis
  const departmentChart = useMemo(() => {
    return (
      departmentsData?.departments?.map((d, i) => ({
        department: d.departmentName,
        tickets: d.totalTickets,
        resolved: d.resolvedTickets,
        resolutionRate: d.resolutionRate,
        avgResolutionHours:
          d.avgResolutionHours ?? overview?.avgResolutionHours ?? 0,
        color: FALLBACK_COLORS[i % FALLBACK_COLORS.length], // ✅ manually assign UI colors
      })) || []
    );
  }, [departmentsData, overview]);

  // Refresh logic
  const onRefresh = () => {
    if (reportType === "overview") r1();
    if (reportType === "performance") {
      r1();
      r2();
      r3();
      r5();
    }
    if (reportType === "department") r4();
    if (reportType === "agent") r1();
  };

  const departmentOptions = useMemo(() => {
    return [
      { label: "All Departments", value: "all" },
      ...(departmentsData?.departments?.map((d) => ({
        label: d.departmentName,
        value: d.id,
      })) || []),
    ];
  }, [departmentsData]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* HEADER */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Reports & Analytics
            </Typography>
            <Typography color="text.secondary">
              Comprehensive ticket insights
            </Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <Button variant="outlined" startIcon={<Print />}>
              Print
            </Button>
            <Button variant="contained" startIcon={<FileDownload />}>
              Export
            </Button>
          </Stack>
        </Box>

        {/* FILTERS */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Report Type */}

            {/* Department */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departmentOptions.map((opt, i) => (
                  <MenuItem key={i} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Start & End */}
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(v) => setDateRange({ ...dateRange, start: v })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(v) => setDateRange({ ...dateRange, end: v })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            {/* REFRESH */}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                sx={{ height: 56 }}
                onClick={onRefresh}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* GLOBAL LOADER & ERROR */}
        {/* {isAnyLoading && (
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <CircularProgress size={18} />
            <Typography>Loading data…</Typography>
          </Stack>
        )}
        {anyError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load report data.
          </Alert>
        )}
        {overview?.message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {overview.message}
          </Alert>
        )} */}

        {/* STATS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tickets"
              value={overview?.totalTickets ?? "N/A"}
              subtitle="Selected range"
              icon={Assessment}
              color="#8B5CF6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Resolution Time"
              value={overview?.avgResolutionHumanized ?? "N/A"}
              subtitle="Across tickets"
              icon={Speed}
              color="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Resolution Rate"
              value={`${overview?.resolutionRatePercent ?? 0}%`}
              subtitle="On-time resolution"
              icon={TrendingUp}
              color="#34D399"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Agents"
              value={overview?.activeAgents ?? 0}
              subtitle="Handling tickets"
              icon={People}
              color="#FBBF24"
            />
          </Grid>
        </Grid>

        {/* CHARTS */}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Ticket Trends */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ticket Trends (7 Days)
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Created"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#34D399"
                    strokeWidth={2}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Tickets by Status */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tickets by Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusesChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, payload }) => `${name} (${payload.value})`}
                    outerRadius={80}
                    dataKey="value" // ✅ keep this, but remove fill="" from <Pie>
                  >
                    {statusesChart.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={
                          entry.color ||
                          FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                        } // ✅ assign fallback color
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Tickets by Priority */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tickets by Priority
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prioritiesChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Department Performance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Department Performance
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={departmentChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tickets" name="Tickets" radius={[6, 6, 0, 0]}>
                      {departmentChart.map((entry, i) => (
                        <Cell key={`bar-cell-${i}`} fill={entry.color} /> // ✅ colors now applied!
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
        {/* Department Stats Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Department Statistics
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ overflowX: "auto" }}>
            <Box
              component="table"
              sx={{ width: "100%", borderCollapse: "collapse" }}
            >
              <Box component="thead">
                <Box
                  component="tr"
                  sx={{ borderBottom: 2, borderColor: "divider" }}
                >
                  <Box component="th" sx={{ textAlign: "left", py: 2, px: 1 }}>
                    Department
                  </Box>
                  <Box component="th" sx={{ textAlign: "right", py: 2, px: 1 }}>
                    Total Tickets
                  </Box>
                  <Box component="th" sx={{ textAlign: "right", py: 2, px: 1 }}>
                    Avg Resolution Time
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {deptStatsData?.departments?.map((d, i) => (
                  <Box
                    component="tr"
                    key={i}
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box component="td" sx={{ py: 2, px: 1 }}>
                      {d.departmentName}
                    </Box>
                    <Box
                      component="td"
                      sx={{ textAlign: "right", py: 2, px: 1 }}
                    >
                      {d.totalTickets}
                    </Box>
                    <Box
                      component="td"
                      sx={{ textAlign: "right", py: 2, px: 1 }}
                    >
                      {d.avgResolutionTimeDays.toFixed(1)} %
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsPage;
