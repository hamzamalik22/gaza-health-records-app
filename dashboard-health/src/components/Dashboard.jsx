import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Refresh,
  Settings,
  Download,
  MoreVert
} from '@mui/icons-material';

// Import dashboard components
import ExecutiveSummary from './ExecutiveSummary';
import GeographicDistribution from './GeographicDistribution';
import DemographicsOverview from './DemographicsOverview';
import HealthMetrics from './HealthMetrics';
import OperationalAnalytics from './OperationalAnalytics';
import TrendAnalysis from './TrendAnalysis';
import RecentActivity from './RecentActivity';
import PatientList from './PatientList';

// Import services
import { 
  getExecutiveSummary,
  getGeographicDistribution,
  getDemographicsOverview,
  getHealthMetrics,
  getOperationalAnalytics,
  getTrendAnalysis,
  getRecentActivity,
  getSyncStatus,
  getAllPatients
} from '../services/dashboardService';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Data states
  const [executiveData, setExecutiveData] = useState(null);
  const [geographicData, setGeographicData] = useState(null);
  const [demographicsData, setDemographicsData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [operationalData, setOperationalData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [allPatients, setAllPatients] = useState(null);
  
  // UI states
  const [selectedArea, setSelectedArea] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        execData,
        geoData,
        demoData,
        healthData,
        opData,
        trendData,
        recentData,
        syncData,
        patientsData
      ] = await Promise.all([
        getExecutiveSummary(),
        getGeographicDistribution(),
        getDemographicsOverview(),
        getHealthMetrics(),
        getOperationalAnalytics(),
        getTrendAnalysis(),
        getRecentActivity(),
        getSyncStatus(),
        getAllPatients()
      ]);

      setExecutiveData(execData);
      setGeographicData(geoData);
      setDemographicsData(demoData);
      setHealthData(healthData);
      setOperationalData(opData);
      setTrendData(trendData);
      setRecentActivity(recentData);
      setSyncStatus(syncData);
      setAllPatients(patientsData);
      
      // Check if we're using mock data (no Supabase connection)
      if (execData && execData.totalPatients === 5) {
        setSnackbar({
          open: true,
          message: 'Using demo data. Connect to Supabase for real data.',
          severity: 'info'
        });
      }
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setSnackbar({
        open: true,
        message: 'Failed to load dashboard data. Please check your connection.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and refresh
  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setSnackbar({
      open: true,
      message: 'Refreshing dashboard data...',
      severity: 'info'
    });
  };

  // Handle menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle export
  const handleExport = () => {
    // TODO: Implement export functionality
    setSnackbar({
      open: true,
      message: 'Export functionality coming soon!',
      severity: 'info'
    });
    handleMenuClose();
  };

  // Handle settings
  const handleSettings = () => {
    // TODO: Implement settings
    setSnackbar({
      open: true,
      message: 'Settings functionality coming soon!',
      severity: 'info'
    });
    handleMenuClose();
  };

  // Handle patient view
  const handleViewPatient = (patient) => {
    // TODO: Implement patient detail view
    setSnackbar({
      open: true,
      message: `Viewing patient: ${patient.name}`,
      severity: 'info'
    });
  };



  // Handle sync refresh
  const handleSyncRefresh = () => {
    loadDashboardData();
  };

  if (loading && !executiveData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NGO Health Records Dashboard
          </Typography>
          
          <IconButton color="inherit" onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
          
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleExport}>
              <Download sx={{ mr: 1 }} />
              Export Data
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 3, mt: 3, width: '100%' }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading Overlay */}
        {loading && (
          <Box 
            position="fixed" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            bgcolor="rgba(255,255,255,0.8)" 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            zIndex={9999}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Dashboard Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Executive Summary" />
            <Tab label="Geographic Distribution" />
            <Tab label="Demographics" />
            <Tab label="Health Metrics" />
            <Tab label="Operational Analytics" />
            <Tab label="Trend Analysis" />
            <Tab label="Recent Activity" />
            <Tab label="Patient List" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <ExecutiveSummary 
            data={executiveData} 
            syncStatus={syncStatus}
            onRefresh={handleSyncRefresh}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <GeographicDistribution 
            data={geographicData}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <DemographicsOverview data={demographicsData} />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <HealthMetrics data={healthData} />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <OperationalAnalytics data={operationalData} />
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <TrendAnalysis data={trendData} />
        </TabPanel>

        <TabPanel value={activeTab} index={6}>
          <RecentActivity 
            data={recentActivity}
            onViewPatient={handleViewPatient}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={7}>
          <PatientList 
            data={allPatients}
            onViewPatient={handleViewPatient}
          />
        </TabPanel>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 