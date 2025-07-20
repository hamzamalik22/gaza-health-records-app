import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Person, 
  LocationOn, 
  LocalHospital, 
  Schedule,
  Refresh,
  Visibility
} from '@mui/icons-material';
import { format } from 'date-fns';

const RecentActivity = ({ data, onViewPatient }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography variant="body2" color="textSecondary">
            No recent activity to display
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getConditionColor = (condition) => {
    const conditions = {
      'Emergency': 'error',
      'Critical': 'error',
      'Urgent': 'warning',
      'Routine': 'success',
      'Follow-up': 'info'
    };
    return conditions[condition] || 'default';
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <Box sx={{ pb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          Recent Activity
        </Typography>
        <Tooltip title="Refresh">
          <IconButton size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={2}>
        {/* Recent Registrations */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Patient Registrations
              </Typography>
              <List>
                {data.slice(0, 10).map((patient, index) => (
                  <React.Fragment key={patient.unique_id || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" component="span">
                              {patient.name || 'Unknown Patient'}
                            </Typography>
                            <Box display="flex" gap={1}>
                              {patient.medical_condition && (
                                <Chip 
                                  label={patient.medical_condition}
                                  color={getConditionColor(patient.medical_condition)}
                                  size="small"
                                />
                              )}
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => onViewPatient(patient)}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  {patient.area_code?.replace(/_/g, ' ') || 'Unknown Area'}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Schedule fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  {getTimeAgo(patient.created_at_cloud)}
                                </Typography>
                              </Box>
                            </Box>
                            {patient.medical_condition && (
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <LocalHospital fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  {patient.medical_condition}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < data.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Activity Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {data.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Recent Registrations
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Registrations by Time
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="success.dark">
                        {data.filter(p => {
                          const hours = p.created_at_cloud ? 
                            Math.floor((new Date() - p.created_at_cloud) / (1000 * 60 * 60)) : 999;
                          return hours < 24;
                        }).length}
                      </Typography>
                      <Typography variant="caption" color="success.dark">
                        Last 24h
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, bgcolor: 'warning.light', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="h6" color="warning.dark">
                        {data.filter(p => {
                          const hours = p.created_at_cloud ? 
                            Math.floor((new Date() - p.created_at_cloud) / (1000 * 60 * 60)) : 999;
                          return hours >= 24 && hours < 168;
                        }).length}
                      </Typography>
                      <Typography variant="caption" color="warning.dark">
                        Last Week
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Top Areas
                </Typography>
                {Object.entries(
                  data.reduce((acc, patient) => {
                    const area = patient.area_code?.replace(/_/g, ' ') || 'Unknown';
                    acc[area] = (acc[area] || 0) + 1;
                    return acc;
                  }, {})
                )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([area, count]) => (
                  <Box key={area} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">{area}</Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Common Conditions
                </Typography>
                {Object.entries(
                  data.reduce((acc, patient) => {
                    if (patient.medical_condition) {
                      acc[patient.medical_condition] = (acc[patient.medical_condition] || 0) + 1;
                    }
                    return acc;
                  }, {})
                )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([condition, count]) => (
                  <Box key={condition} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">{condition}</Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecentActivity; 