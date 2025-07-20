import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Devices, 
  Schedule, 
  TrendingUp, 
  Assessment 
} from '@mui/icons-material';

const OperationalAnalytics = ({ data }) => {
  if (!data) return null;

  // Prepare device usage data
  const deviceChartData = Object.entries(data.deviceUsage)
    .map(([device, count]) => ({
      device: device === 'Unknown' ? 'Unknown Device' : device,
      registrations: count
    }))
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 10);

  // Prepare hourly distribution data
  const hourlyChartData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    registrations: data.hourlyDistribution[hour] || 0
  }));

  // Prepare daily distribution data
  const dailyChartData = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ].map(day => ({
    day,
    registrations: data.dailyDistribution[day] || 0
  }));

  // Calculate peak hours
  const peakHour = hourlyChartData.reduce((max, current) => 
    current.registrations > max.registrations ? current : max
  );

  // Calculate busiest day
  const busiestDay = dailyChartData.reduce((max, current) => 
    current.registrations > max.registrations ? current : max
  );

  // Calculate average daily registrations
  const avgDailyRegistrations = dailyChartData.reduce((sum, day) => sum + day.registrations, 0) / 7;

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Operational Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Devices sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {Object.keys(data.deviceUsage).length}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Active Devices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {peakHour.hour}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Peak Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {busiestDay.day}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Busiest Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {avgDailyRegistrations.toFixed(1)}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Avg Daily Registrations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Usage */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Usage (Top 10)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deviceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="device" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Registrations']}
                    labelFormatter={(label) => `Device: ${label}`}
                  />
                  <Bar dataKey="registrations" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Peak Hours */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Peak Hours Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Registrations']}
                    labelFormatter={(label) => `Hour: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Registration Patterns
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Registrations']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Bar dataKey="registrations" fill="#82CA9D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Performance Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Performance
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Device</strong></TableCell>
                      <TableCell align="right"><strong>Registrations</strong></TableCell>
                      <TableCell align="right"><strong>Performance</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deviceChartData.slice(0, 5).map((device, index) => {
                      const performance = device.registrations > avgDailyRegistrations * 2 ? 'High' : 
                                        device.registrations > avgDailyRegistrations ? 'Medium' : 'Low';
                      
                      return (
                        <TableRow key={device.device}>
                          <TableCell component="th" scope="row">
                            {device.device}
                          </TableCell>
                          <TableCell align="right">{device.registrations}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={performance} 
                              color={performance === 'High' ? 'success' : performance === 'Medium' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Operational Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Operational Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Peak Activity Time
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {peakHour.hour} ({peakHour.registrations} registrations)
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Consider scheduling more staff during this time
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Busiest Day of Week
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {busiestDay.day} ({busiestDay.registrations} registrations)
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Plan resources accordingly
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Capacity Planning
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {avgDailyRegistrations.toFixed(1)} avg daily
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Use this for resource allocation
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperationalAnalytics; 