import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  People, 
  Sync, 
  CheckCircle, 
  Warning,
  Refresh
} from '@mui/icons-material';
import { format } from 'date-fns';

const MetricCard = ({ title, value, subtitle, trend, trendPercentage, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%', position: 'relative' }}>
    <CardContent sx={{ py: 2, px: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: 2, 
            bgcolor: `${color}.light`, 
            color: `${color}.main` 
          }}
        >
          {icon}
        </Box>
      </Box>
      
      {trend && (
        <Box display="flex" alignItems="center" mt={2}>
          {trend === 'up' ? (
            <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
          ) : (
            <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
          )}
          <Typography 
            variant="body2" 
            color={trend === 'up' ? 'success.main' : 'error.main'}
          >
            {trend === 'up' ? '+' : ''}{trendPercentage}%
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const SyncStatusCard = ({ syncStatus, onRefresh }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ py: 2, px: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div">
          Sync Status
        </Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        {parseFloat(syncStatus.syncRate) >= 90 ? (
          <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
        ) : (
          <Warning sx={{ color: 'warning.main', mr: 1 }} />
        )}
        <Typography variant="h6" component="div">
          {typeof syncStatus.syncRate === 'string' ? syncStatus.syncRate : syncStatus.syncRate + '%'}
        </Typography>
      </Box>
      
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Synced: {syncStatus.synced} / {syncStatus.total}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={parseFloat(syncStatus.syncRate) || 0} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      <Box display="flex" gap={1} flexWrap="wrap">
        {syncStatus.pending > 0 && (
          <Chip 
            label={`${syncStatus.pending} Pending`} 
            color="warning" 
            size="small" 
          />
        )}
        {syncStatus.failed > 0 && (
          <Chip 
            label={`${syncStatus.failed} Failed`} 
            color="error" 
            size="small" 
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

const DataCompletenessCard = ({ completeness }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ py: 2, px: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Data Completeness
      </Typography>
      
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {completeness}%
        </Typography>
      </Box>
      
      <Box mb={2}>
        <LinearProgress 
          variant="determinate" 
          value={completeness} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      <Typography variant="body2" color="textSecondary">
        {completeness >= 90 ? 'Excellent data quality' : 
         completeness >= 70 ? 'Good data quality' : 
         completeness >= 50 ? 'Fair data quality' : 'Needs improvement'}
      </Typography>
    </CardContent>
  </Card>
);

const ExecutiveSummary = ({ data, syncStatus, onRefresh }) => {
  if (!data) return null;

  return (
    <Box sx={{ pb: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        Executive Summary
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Patients"
            value={data.totalPatients.toLocaleString()}
            subtitle="All time registrations"
            icon={<People />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Active This Month"
            value={data.activeThisMonth}
            subtitle={`vs ${data.activeLastMonth} last month`}
            trend={data.trend}
            trendPercentage={data.trendPercentage}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <SyncStatusCard syncStatus={syncStatus} onRefresh={onRefresh} />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <DataCompletenessCard completeness={data.dataCompleteness} />
        </Grid>
      </Grid>
      
      {/* Quick Stats Bar */}
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Stats
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <People sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Today's Registrations
                  </Typography>
                  <Typography variant="h6">
                    {data.activeThisMonth > 0 ? Math.floor(data.activeThisMonth / 30) : 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <Sync sx={{ mr: 1, color: 'warning.main' }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Pending Syncs
                  </Typography>
                  <Typography variant="h6">
                    {syncStatus?.pending || 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Device Status
                  </Typography>
                  <Typography variant="h6">
                    Online
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExecutiveSummary; 