import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DemographicsOverview = ({ data }) => {
  if (!data) return null;

  // Prepare age distribution data
  const ageChartData = Object.entries(data.ageDistribution).map(([age, count]) => ({
    age,
    count,
    percentage: ((count / data.totalPatients) * 100).toFixed(1)
  }));

  // Prepare gender distribution data
  const genderChartData = Object.entries(data.genderDistribution).map(([gender, count]) => ({
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    count,
    percentage: ((count / data.totalPatients) * 100).toFixed(1)
  }));

  // Calculate average age
  const totalAge = Object.entries(data.ageDistribution).reduce((sum, [age, count]) => {
    const ageRange = age.split('-');
    const avgAge = ageRange.length > 1 
      ? (parseInt(ageRange[0]) + parseInt(ageRange[1])) / 2 
      : parseInt(ageRange[0]) + 5; // For 50+ group
    return sum + (avgAge * count);
  }, 0);
  const averageAge = data.totalPatients > 0 ? (totalAge / data.totalPatients).toFixed(1) : 0;

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Demographics Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {data.totalPatients}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Total Patients
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                {averageAge}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Average Age
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                {data.genderDistribution.male + data.genderDistribution.female}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Gender Recorded
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Age Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Age Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Patients']}
                    labelFormatter={(label) => `Age: ${label}`}
                  />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gender Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percentage }) => `${gender} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {genderChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Patients']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Demographics Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Demographics
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Age Group</strong></TableCell>
                      <TableCell align="right"><strong>Count</strong></TableCell>
                      <TableCell align="right"><strong>Percentage</strong></TableCell>
                      <TableCell align="right"><strong>Male</strong></TableCell>
                      <TableCell align="right"><strong>Female</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ageChartData.map((row) => (
                      <TableRow key={row.age}>
                        <TableCell component="th" scope="row">
                          {row.age} years
                        </TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">{row.percentage}%</TableCell>
                        <TableCell align="right">
                          {/* This would need additional data from the API */}
                          {Math.round(row.count * 0.5)}
                        </TableCell>
                        <TableCell align="right">
                          {/* This would need additional data from the API */}
                          {Math.round(row.count * 0.5)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>{data.totalPatients}</strong></TableCell>
                      <TableCell align="right"><strong>100%</strong></TableCell>
                      <TableCell align="right"><strong>{data.genderDistribution.male}</strong></TableCell>
                      <TableCell align="right"><strong>{data.genderDistribution.female}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
                      Largest Age Group
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {ageChartData.reduce((max, current) => 
                        current.count > max.count ? current : max
                      ).age} years
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Gender Ratio
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {data.genderDistribution.male > 0 ? 
                        (data.genderDistribution.female / data.genderDistribution.male).toFixed(2) : 0} 
                      (F:M)
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Pediatric Patients (0-18)
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {ageChartData
                        .filter(age => ['0-5', '6-12', '13-18'].includes(age.age))
                        .reduce((sum, age) => sum + age.count, 0)}
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

export default DemographicsOverview; 