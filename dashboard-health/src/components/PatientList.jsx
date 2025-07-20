import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Download,
  Person,
  LocationOn,
  LocalHospital,
  Phone,
  Email,
  CalendarToday,
  AccessTime,
  Clear
} from '@mui/icons-material';

const PatientList = ({ data, onViewPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get unique areas and conditions for filters
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(data?.map(p => p.area_code?.replace(/_/g, ' ')) || [])];
    return uniqueAreas.filter(area => area && area !== 'undefined').sort();
  }, [data]);

  const conditions = useMemo(() => {
    const uniqueConditions = [...new Set(data?.map(p => p.medical_condition).filter(Boolean) || [])];
    return uniqueConditions.sort();
  }, [data]);

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    if (!data) return [];
    
    return data.filter(patient => {
      const matchesSearch = searchTerm === '' || 
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.area_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.medical_condition?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea = areaFilter === '' || 
        patient.area_code?.replace(/_/g, ' ') === areaFilter;

      const matchesCondition = conditionFilter === '' || 
        patient.medical_condition === conditionFilter;

      return matchesSearch && matchesArea && matchesCondition;
    });
  }, [data, searchTerm, areaFilter, conditionFilter]);

  const getConditionColor = (condition) => {
    const conditions = {
      'Emergency': 'error',
      'Chronic': 'warning',
      'Acute': 'info',
      'Follow-up': 'success'
    };
    return conditions[condition] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPatient(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAreaFilter('');
    setConditionFilter('');
  };

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="textSecondary">
          No patient data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          Patient List
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            size="small"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Area</InputLabel>
                <Select
                  value={areaFilter}
                  label="Area"
                  onChange={(e) => setAreaFilter(e.target.value)}
                >
                  <MenuItem value="">All Areas</MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Condition</InputLabel>
                <Select
                  value={conditionFilter}
                  label="Condition"
                  onChange={(e) => setConditionFilter(e.target.value)}
                >
                  <MenuItem value="">All Conditions</MenuItem>
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
                size="small"
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Showing {filteredPatients.length} of {data.length} patients
        </Typography>
        {(searchTerm || areaFilter || conditionFilter) && (
          <Alert severity="info" sx={{ py: 0 }}>
            Filters applied
          </Alert>
        )}
      </Box>

      {/* Patient Table */}
      <Card>
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Area</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Condition</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Updated</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient, index) => (
                <TableRow 
                  key={patient.unique_id || index}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {patient.name || 'Unknown Patient'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {patient.age ? `${patient.age} years` : 'Age unknown'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {patient.unique_id || 'N/A'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">
                        {patient.area_code?.replace(/_/g, ' ') || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {patient.medical_condition ? (
                      <Chip
                        label={patient.medical_condition}
                        color={getConditionColor(patient.medical_condition)}
                        size="small"
                        icon={<LocalHospital />}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not specified
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(patient.created_at_cloud)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(patient.updated_at_cloud)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewPatient(patient)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Patient Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPatient && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedPatient.name || 'Unknown Patient'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {selectedPatient.unique_id || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Person color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.name || 'Not provided'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <CalendarToday color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Age
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.age ? `${selectedPatient.age} years` : 'Not provided'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <Phone color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.phone || 'Not provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Medical Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LocalHospital color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Medical Condition
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.medical_condition || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <LocationOn color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Area
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.area_code?.replace(/_/g, ' ') || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Registration Details
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <AccessTime color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Registration Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedPatient.created_at_cloud)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <AccessTime color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedPatient.updated_at_cloud)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PatientList; 