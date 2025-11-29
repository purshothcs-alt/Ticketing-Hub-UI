import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Chip,
  Box,
  Button
} from '@mui/material';
import { 
  Add, 
  Assignment, 
  CheckCircle, 
  Edit,
  Comment,
  MoreHoriz, 
  ChangeCircle,
  Repeat,
  AttachFile,
  PriorityHigh,
  Delete,
  PersonAdd,
  WarningAmber,
  Error as ErrorIcon
} from '@mui/icons-material';
import type { RecentActivity } from '../types';
import moment from 'moment';

interface RecentActivityCardProps {
  activities: RecentActivity[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  isLoading = false,
  onViewAll,
}) => {

// Map backend actionType → icon
const getActivityIcon = (action: string) => {
  switch (action) {
    case 'Created':
      return <Add sx={{ color: 'primary.main' }} />;
    case 'Updated':
      return <Edit sx={{ color: 'warning.main' }} />;
    case 'Assigned':
      return <Assignment sx={{ color: 'info.main' }} />;
    case 'Reassigned':
      return <Repeat sx={{ color: 'info.dark' }} />;
    case 'Resolved':
      return <CheckCircle sx={{ color: 'success.main' }} />;
    case 'StatusChanged':
      return <ChangeCircle sx={{ color: 'purple' }} />;
    case 'PriorityChanged':
      return <PriorityHigh sx={{ color: 'error.main' }} />;
    case 'CommentAdded':
      return <Comment sx={{ color: 'secondary.main' }} />;
    case 'AttachmentAdded':
      return <AttachFile sx={{ color: 'grey.600' }} />;
    case 'AttachmentDeleted':
      return <Delete sx={{ color: 'error.light' }} />;
    case 'SubscriberAdded':
      return <PersonAdd sx={{ color: 'info.light' }} />;
    case 'SLALevel1Escalation':
      return <WarningAmber sx={{ color: 'orange' }} />;
    case 'SLALevel2Escalation':
      return <ErrorIcon sx={{ color: 'red' }} />;
    default:
      return <MoreHoriz sx={{ color: 'text.secondary' }} />;
  }
};

// Map backend actionType → color
const getActivityColor = (action: string) => {
  switch (action.toLowerCase()) {
    case 'created': return '#8B5CF6';
    case 'updated': return '#FBBF24';
    case 'assigned': return '#3B82F6';
    case 'reassigned': return '#2563EB';
    case 'statuschanged': return '#A855F7';
    case 'prioritychanged': return '#EF4444';
    case 'commentadded': return '#34D399';
    case 'attachmentadded': return '#6EE7B7';
    case 'attachmentdeleted': return '#F87171';
    case 'subscriberadded': return '#60A5FA';
    case 'slalevel1escalation': return '#FBBF24';
    case 'slalevel2escalation': return '#EF4444';
    case 'resolved': return '#22C55E';
    default: return '#6B7280'; // gray
  }
};



  // Human readable timestamp
const formatTimeAgo = (timestamp: string) => moment(timestamp).fromNow();

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title="Recent Activity"
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'grey.200' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />}
                  secondary={<Box sx={{ height: 12, bgcolor: 'grey.200', borderRadius: 1, width: '70%' }} />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={activities.length > 0 && onViewAll ? <Button size="small" onClick={onViewAll}>View All</Button>:null}
      />

      <CardContent sx={{ pt: 0, pb: 2, flexGrow: 1, overflow: 'hidden' }}>
        {activities.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No recent activity
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: '410px', overflowY: 'auto', pr: 1 }}>
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  borderBottom: index < activities.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  pb: index < activities.length - 1 ? 2 : 0,
                  mb: index < activities.length - 1 ? 2 : 0,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getActivityColor(activity.actionType)}20`,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getActivityIcon(activity.actionType)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>

                      <Chip
                        label={activity.ticketNumber}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          borderColor: getActivityColor(activity.actionType),
                          color: getActivityColor(activity.actionType),
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {activity.actionType} by {activity.userName}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(activity.activityDate)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
