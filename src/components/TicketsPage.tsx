import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search,
  Add,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type Page = 'dashboard' | 'tickets' | 'ticket-details' | 'reports' | 'users' | 'settings';

interface TicketsPageProps {
  onNavigate: (page: Page) => void;
  onViewTicket: (ticketId: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TicketsPage({ onNavigate, onViewTicket, onToggleTheme, isDarkMode, isSidebarCollapsed, onToggleSidebar }: TicketsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const tickets = [
    { id: 'TKT-1001', title: 'Login issue with mobile app', status: 'Open', priority: 'High', assignee: 'John Smith', created: '2023-10-01', updated: '2 hours ago' },
    { id: 'TKT-1002', title: 'Database performance slow', status: 'In Progress', priority: 'Medium', assignee: 'Sarah Jones', created: '2023-10-01', updated: '4 hours ago' },
    { id: 'TKT-1003', title: 'Email notifications not working', status: 'Open', priority: 'Low', assignee: 'Mike Chen', created: '2023-09-30', updated: '6 hours ago' },
    { id: 'TKT-1004', title: 'User account locked', status: 'Resolved', priority: 'Medium', assignee: 'Lisa Davis', created: '2023-09-30', updated: '8 hours ago' },
    { id: 'TKT-1005', title: 'Payment gateway timeout', status: 'Open', priority: 'High', assignee: 'Tom Wilson', created: '2023-09-29', updated: '1 day ago' },
    { id: 'TKT-1006', title: 'UI bug in dashboard', status: 'In Progress', priority: 'Low', assignee: 'Emma Brown', created: '2023-09-29', updated: '1 day ago' },
    { id: 'TKT-1007', title: 'Server maintenance required', status: 'Planned', priority: 'High', assignee: 'Alex Johnson', created: '2023-09-28', updated: '2 days ago' },
    { id: 'TKT-1008', title: 'Feature request: Dark mode', status: 'Open', priority: 'Low', assignee: 'John Smith', created: '2023-09-28', updated: '2 days ago' },
  ];

  const getStatusColor = (status: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'Open': return 'error';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Planned': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="tickets" onNavigate={onNavigate} isCollapsed={isSidebarCollapsed} onToggleCollapse={onToggleSidebar} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title="Tickets" onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Stack spacing={3}>
            {/* Filters and Actions */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
                <TextField
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  sx={{ minWidth: 250 }}
                />
                
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Planned">Planned</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="table">
                    <ViewList />
                  </ToggleButton>
                  <ToggleButton value="cards">
                    <ViewModule />
                  </ToggleButton>
                </ToggleButtonGroup>
                <Button variant="contained" startIcon={<Add />}>
                  New Ticket
                </Button>
              </Stack>
            </Box>

            {/* Results Count */}
            <Typography variant="body2" color="text.secondary">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </Typography>

            {/* Tickets List */}
            {viewMode === 'table' ? (
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ticket ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Updated</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => onViewTicket(ticket.id)}
                        >
                          <TableCell sx={{ fontWeight: 'medium' }}>{ticket.id}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" noWrap>
                              {ticket.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.status}
                              color={getStatusColor(ticket.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.priority}
                              color={getPriorityColor(ticket.priority)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{ticket.assignee}</TableCell>
                          <TableCell>{ticket.created}</TableCell>
                          <TableCell>{ticket.updated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filteredTickets.map((ticket) => (
                  <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => onViewTicket(ticket.id)}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                              {ticket.id}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <Chip
                                label={ticket.status}
                                color={getStatusColor(ticket.status)}
                                size="small"
                              />
                              <Chip
                                label={ticket.priority}
                                color={getPriorityColor(ticket.priority)}
                                size="small"
                                variant="outlined"
                              />
                            </Stack>
                          </Box>
                          
                          <Typography variant="body2" sx={{ fontWeight: 'medium', lineClamp: 2 }}>
                            {ticket.title}
                          </Typography>
                          
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              Assigned to {ticket.assignee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Created {ticket.created}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Updated {ticket.updated}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Page 1 of 1
              </Typography>
              <Pagination count={1} page={1} color="primary" />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}