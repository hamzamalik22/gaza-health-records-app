import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Chip,
  LinearProgress,
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  LocalHospital, 
  Warning, 
  TrendingUp, 
  People 
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const HealthMetrics = ({ data }) => {
  if (!data) return null;

  // Prepare top conditions data for chart
  const conditionsChartData = data.topConditions.map((condition, index) => ({
    ...condition,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate emergency rate
  const emergencyRate = data.totalPatients > 0 ? 
    ((data.emergencyCases / data.totalPatients) * 100).toFixed(1) : 0;

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Health Metrics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {data.topConditions.length}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Common Conditions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {data.emergencyCases}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Emergency Cases
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {emergencyRate}%
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Emergency Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {data.totalPatients}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Total Patients
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Medical Conditions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Medical Conditions
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conditionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="condition" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Patients']}
                    labelFormatter={(label) => `Condition: ${label}`}
                  />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Condition Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Condition Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conditionsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ condition, count }) => `${condition} (${count})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {conditionsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Patients']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical Conditions Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medical Conditions Analysis
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Condition</strong></TableCell>
                      <TableCell align="right"><strong>Count</strong></TableCell>
                      <TableCell align="right"><strong>Percentage</strong></TableCell>
                      <TableCell align="right"><strong>Severity Level</strong></TableCell>
                      <TableCell align="right"><strong>Action Required</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topConditions.map((condition, index) => {
                      const percentage = ((condition.count / data.totalPatients) * 100).toFixed(1);
                      const severity = percentage > 20 ? 'High' : percentage > 10 ? 'Medium' : 'Low';
                      const action = severity === 'High' ? 'Immediate' : severity === 'Medium' ? 'Monitor' : 'Routine';
                      
                      return (
                        <TableRow key={condition.condition}>
                          <TableCell component="th" scope="row">
                            {condition.condition}
                          </TableCell>
                          <TableCell align="right">{condition.count}</TableCell>
                          <TableCell align="right">{percentage}%</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={severity} 
                              color={severity === 'High' ? 'error' : severity === 'Medium' ? 'warning' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={action} 
                              color={action === 'Immediate' ? 'error' : action === 'Monitor' ? 'warning' : 'success'}
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

        {/* Emergency Cases Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emergency Cases Analysis
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Emergency Rate</Typography>
                  <Typography variant="body2">{emergencyRate}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(emergencyRate)} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color={parseFloat(emergencyRate) > 10 ? 'error' : parseFloat(emergencyRate) > 5 ? 'warning' : 'success'}
                />
              </Box>
              
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Emergency Cases in Last 30 Days
                </Typography>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                  {data.emergencyCases}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {data.emergencyCases > 0 ? 
                    `Average ${(data.emergencyCases / 30).toFixed(1)} cases per day` : 
                    'No emergency cases recorded'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Most Common Condition
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {data.topConditions[0]?.condition || 'No data'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {data.topConditions[0]?.count || 0} patients affected
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Emergency Trend
                    </Typography>
                    <Typography variant="h6" color={parseFloat(emergencyRate) > 10 ? 'error.main' : 'success.main'}>
                      {parseFloat(emergencyRate) > 10 ? 'High' : parseFloat(emergencyRate) > 5 ? 'Moderate' : 'Low'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {parseFloat(emergencyRate) > 10 ? 'Requires immediate attention' : 
                       parseFloat(emergencyRate) > 5 ? 'Monitor closely' : 'Within normal range'}
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

export default HealthMetrics; 