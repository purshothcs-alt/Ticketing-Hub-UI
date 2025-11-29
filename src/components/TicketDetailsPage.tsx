import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  FileCopy,
  Link,
  GetApp,
  Add,
} from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type Page = 'dashboard' | 'tickets' | 'ticket-details' | 'reports' | 'users' | 'settings';

interface TicketDetailsPageProps {
  ticketId: string | null;
  onNavigate: (page: Page) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TicketDetailsPage({ ticketId, onNavigate, onToggleTheme, isDarkMode, isSidebarCollapsed, onToggleSidebar }: TicketDetailsPageProps) {
  const [newComment, setNewComment] = useState('');
  const [ticketStatus, setTicketStatus] = useState('Open');
  const [ticketPriority, setTicketPriority] = useState('High');

  // Mock ticket data - in real app would fetch based on ticketId
  const ticket = {
    id: ticketId || 'TKT-1001',
    title: 'Login issue with mobile app',
    description: 'Users are experiencing login failures on the mobile application. The issue seems to be related to the authentication service returning 500 errors intermittently. This affects approximately 15% of our mobile users.',
    status: ticketStatus,
    priority: ticketPriority,
    assignee: 'John Smith',
    reporter: 'Alice Johnson',
    created: '2023-10-01 09:30 AM',
    updated: '2023-10-01 11:45 AM',
    category: 'Authentication',
    tags: ['mobile', 'login', 'authentication'],
  };

  const comments = [
    {
      id: 1,
      author: 'Alice Johnson',
      role: 'Reporter',
      content: 'I\'ve tried logging in multiple times but keep getting an error message. This started happening this morning around 9 AM.',
      timestamp: '2023-10-01 09:35 AM',
      avatar: 'AJ'
    },
    {
      id: 2,
      author: 'John Smith',
      role: 'Developer',
      content: 'Thanks for reporting this. I\'m looking into the authentication service logs now. Can you tell me which device and OS version you\'re using?',
      timestamp: '2023-10-01 10:15 AM',
      avatar: 'JS'
    },
    {
      id: 3,
      author: 'Alice Johnson',
      role: 'Reporter',
      content: 'I\'m using an iPhone 14 with iOS 16.6. Several other users have reported the same issue on our company Slack.',
      timestamp: '2023-10-01 10:30 AM',
      avatar: 'AJ'
    },
    {
      id: 4,
      author: 'John Smith',
      role: 'Developer',
      content: 'Found the issue! There was a deployment that introduced a bug in the token validation. I\'m working on a fix now.',
      timestamp: '2023-10-01 11:45 AM',
      avatar: 'JS'
    },
  ];

  const attachments = [
    { id: 1, name: 'error-screenshot.png', size: '245 KB', type: 'image' },
    { id: 2, name: 'login-logs.txt', size: '12 KB', type: 'text' },
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In real app, would post comment to backend
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const getStatusColor = (status: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'Open': return 'error';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
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

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="ticket-details" onNavigate={onNavigate} isCollapsed={isSidebarCollapsed} onToggleCollapse={onToggleSidebar} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={`Ticket ${ticket.id}`} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Stack spacing={3}>
              {/* Back Button */}
              <Button
                startIcon={<ArrowBack />}
                onClick={() => onNavigate('tickets')}
                sx={{ alignSelf: 'flex-start' }}
              >
                Back to Tickets
              </Button>

              <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12} lg={8}>
                  <Stack spacing={3}>
                    {/* Ticket Header */}
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Stack spacing={2}>
                            <Typography variant="h2">{ticket.title}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={ticket.status}
                                color={getStatusColor(ticket.status)}
                              />
                              <Chip
                                label={ticket.priority}
                                color={getPriorityColor(ticket.priority)}
                                variant="outlined"
                              />
                              <Typography variant="body2" color="text.secondary">
                                #{ticket.id}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={ticketStatus}
                                label="Status"
                                onChange={(e) => setTicketStatus(e.target.value)}
                              >
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Resolved">Resolved</MenuItem>
                                <MenuItem value="Closed">Closed</MenuItem>
                              </Select>
                            </FormControl>
                            <Button variant="contained">Save Changes</Button>
                          </Stack>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {ticket.description}
                        </Typography>
                      </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                      <CardContent>
                        <Typography variant="h3" gutterBottom>
                          Comments
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Conversation history and updates
                        </Typography>
                        
                        <Stack spacing={3}>
                          {comments.map((comment, index) => (
                            <Box key={comment.id}>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {comment.avatar}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="subtitle2">{comment.author}</Typography>
                                    <Chip label={comment.role} size="small" variant="outlined" />
                                    <Typography variant="caption" color="text.secondary">
                                      {comment.timestamp}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                    {comment.content}
                                  </Typography>
                                </Box>
                              </Box>
                              {index < comments.length - 1 && <Divider sx={{ mt: 3 }} />}
                            </Box>
                          ))}
                          
                          {/* Add Comment */}
                          <Divider />
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
                            <Box sx={{ flex: 1 }}>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                sx={{ mb: 2 }}
                              />
                              <Button
                                variant="contained"
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                              >
                                Add Comment
                              </Button>
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Attachments */}
                    <Card>
                      <CardContent>
                        <Typography variant="h3" gutterBottom>
                          Attachments
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Files and documents
                        </Typography>
                        
                        <Stack spacing={2}>
                          {attachments.map((attachment) => (
                            <Box
                              key={attachment.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 2,
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'action.hover',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {attachment.type === 'image' ? '🖼️' : '📄'}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle2">{attachment.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {attachment.size}
                                  </Typography>
                                </Box>
                              </Box>
                              <IconButton size="small">
                                <GetApp />
                              </IconButton>
                            </Box>
                          ))}
                          <Button variant="outlined" startIcon={<Add />} fullWidth>
                            Add Attachment
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={4}>
                  <Stack spacing={3}>
                    {/* Ticket Info */}
                    <Card>
                      <CardContent>
                        <Typography variant="h3" gutterBottom>
                          Ticket Details
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Assignee
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {ticket.assignee}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Reporter
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {ticket.reporter}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Category
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {ticket.category}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Created
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {ticket.created}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Last Updated
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {ticket.updated}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Tags
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {ticket.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                      <CardContent>
                        <Typography variant="h3" gutterBottom>
                          Actions
                        </Typography>
                        <Stack spacing={1}>
                          <Button variant="outlined" startIcon={<Person />} fullWidth>
                            Assign to Me
                          </Button>
                          <Button variant="outlined" startIcon={<FileCopy />} fullWidth>
                            Duplicate Ticket
                          </Button>
                          <Button variant="outlined" startIcon={<Link />} fullWidth>
                            Link Ticket
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}