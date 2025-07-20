import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const GeographicDistribution = ({ data, selectedArea, onAreaChange }) => {
  if (!data) return null;

  // Prepare data for charts
  const areaChartData = Object.entries(data.areaStats).map(([area, count]) => ({
    area: area.replace(/_/g, ' '),
    patients: count,
    percentage: ((count / data.totalPatients) * 100).toFixed(1)
  }));

  const pieChartData = Object.entries(data.areaStats).map(([area, count]) => ({
    name: area.replace(/_/g, ' '),
    value: count
  }));

  // Prepare trend data for selected area
  const trendData = selectedArea && data.monthlyTrends[selectedArea] 
    ? Object.entries(data.monthlyTrends[selectedArea])
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
          month: month.split('-')[1] + '/' + month.split('-')[0].slice(-2),
          patients: count
        }))
    : [];

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Geographic Distribution
      </Typography>
      
      <Grid container spacing={3}>
        {/* Area Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Area for Trend Analysis</InputLabel>
            <Select
              value={selectedArea || ''}
              label="Select Area for Trend Analysis"
              onChange={(e) => onAreaChange(e.target.value)}
            >
              <MenuItem value="">All Areas</MenuItem>
              {Object.keys(data.areaStats).map((area) => (
                <MenuItem key={area} value={area}>
                  {area.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Bar Chart - Patients per Area */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patients per Area
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="area" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Patients']}
                    labelFormatter={(label) => `Area: ${label}`}
                  />
                  <Bar dataKey="patients" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart - Area Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribution by Area
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Patients']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Trend Chart - Monthly Growth by Area */}
        {selectedArea && trendData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Registration Trend - {selectedArea.replace(/_/g, ' ')}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, 'Patients']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Area Statistics Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Area Statistics
              </Typography>
              <Grid container spacing={2}>
                {areaChartData.map((area) => (
                  <Grid item xs={12} sm={6} md={4} key={area.area}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        {area.patients}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {area.area}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {area.percentage}% of total
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeographicDistribution; 