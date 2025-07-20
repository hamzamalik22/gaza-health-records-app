import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Analytics, 
  Timeline 
} from '@mui/icons-material';

const TrendAnalysis = ({ data }) => {
  if (!data) return null;

  // Prepare monthly growth data
  const monthlyGrowthData = Object.entries(data.monthlyGrowth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: month.split('-')[1] + '/' + month.split('-')[0].slice(-2),
      registrations: count
    }));

  // Prepare seasonal patterns data
  const seasonalData = Object.entries(data.seasonalPatterns)
    .map(([month, count]) => ({
      month,
      registrations: count
    }));

  // Calculate growth rate
  const growthRate = monthlyGrowthData.length > 1 ? 
    ((monthlyGrowthData[monthlyGrowthData.length - 1].registrations - monthlyGrowthData[0].registrations) / 
     monthlyGrowthData[0].registrations * 100).toFixed(1) : 0;

  // Calculate average monthly growth
  const avgMonthlyGrowth = monthlyGrowthData.length > 1 ? 
    (monthlyGrowthData[monthlyGrowthData.length - 1].registrations / monthlyGrowthData.length).toFixed(1) : 0;

  // Predict next 3 months
  const lastMonth = monthlyGrowthData[monthlyGrowthData.length - 1];
  const predictedData = Array.from({ length: 3 }, (_, i) => ({
    month: `Predicted ${i + 1}`,
    registrations: Math.round(lastMonth.registrations * (1 + (growthRate / 100) * (i + 1)))
  }));

  const combinedData = [...monthlyGrowthData, ...predictedData];

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Trend Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {growthRate}%
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Growth Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {avgMonthlyGrowth}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Avg Monthly Growth
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Timeline sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {monthlyGrowthData.length}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Months Tracked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {predictedData[2]?.registrations || 0}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Predicted (3 months)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Growth Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Growth Trend (with Predictions)
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Registrations']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Seasonal Patterns */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seasonal Patterns
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Registrations']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="registrations" fill="#82CA9D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Growth Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Growth Analysis
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Overall Growth Rate</Typography>
                  <Typography variant="body2">{growthRate}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(Math.abs(parseFloat(growthRate)), 100)} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color={parseFloat(growthRate) > 0 ? 'success' : 'error'}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Average Monthly Growth</Typography>
                  <Typography variant="body2">{avgMonthlyGrowth} patients</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(parseFloat(avgMonthlyGrowth) / 10, 100)} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="primary"
                />
              </Box>

              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Growth Trend
                </Typography>
                <Typography variant="h6" color={parseFloat(growthRate) > 0 ? 'success.main' : 'error.main'}>
                  {parseFloat(growthRate) > 0 ? 'Positive' : 'Negative'} Growth
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {parseFloat(growthRate) > 0 ? 
                    'Patient registrations are increasing' : 
                    'Patient registrations are decreasing'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Predictive Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predictive Analytics
              </Typography>
              
              <Grid container spacing={2}>
                {predictedData.map((prediction, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {prediction.month}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {prediction.registrations} patients
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Based on current growth rate
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="warning.dark" gutterBottom>
                  Resource Planning Recommendation
                </Typography>
                <Typography variant="body2" color="warning.dark">
                  Based on predicted growth, consider increasing staff and resources by{' '}
                  {Math.round((predictedData[2]?.registrations - lastMonth?.registrations) / lastMonth?.registrations * 100)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Best Performing Month
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {seasonalData.reduce((max, current) => 
                        current.registrations > max.registrations ? current : max
                      ).month}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Growth Momentum
                    </Typography>
                    <Typography variant="h6" color={parseFloat(growthRate) > 10 ? 'success.main' : 'warning.main'}>
                      {parseFloat(growthRate) > 10 ? 'Strong' : parseFloat(growthRate) > 5 ? 'Moderate' : 'Weak'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Forecast Accuracy
                    </Typography>
                    <Typography variant="h6" color="info.main">
                      {monthlyGrowthData.length > 3 ? 'High' : 'Medium'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Based on {monthlyGrowthData.length} months of data
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

export default TrendAnalysis; 