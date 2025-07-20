import { supabase } from '../config/supabase.js';
import {
  mockGetExecutiveSummary,
  mockGetSyncStatus,
  mockGetGeographicDistribution,
  mockGetDemographicsOverview,
  mockGetHealthMetrics,
  mockGetOperationalAnalytics,
  mockGetTrendAnalysis,
  mockGetRecentActivity
} from './mockData.js';

// Get executive summary statistics
export async function getExecutiveSummary() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetExecutiveSummary();
    }
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const totalPatients = patients.length;
    const activeThisMonth = patients.filter(p => 
      new Date(p.created_at_cloud) >= thisMonth
    ).length;
    const activeLastMonth = patients.filter(p => 
      new Date(p.created_at_cloud) >= lastMonth && 
      new Date(p.created_at_cloud) < thisMonth
    ).length;
    
    const syncedCount = patients.filter(p => p.cloud_sync_status === 'synced').length;
    const dataCompleteness = patients.length > 0 ? 
      (patients.filter(p => p.name && p.age && p.gender).length / patients.length * 100).toFixed(1) : 0;
    
    return {
      totalPatients,
      activeThisMonth,
      activeLastMonth,
      syncedCount,
      dataCompleteness: parseFloat(dataCompleteness),
      trend: activeThisMonth > activeLastMonth ? 'up' : 'down',
      trendPercentage: activeLastMonth > 0 ? 
        ((activeThisMonth - activeLastMonth) / activeLastMonth * 100).toFixed(1) : 
        activeThisMonth > 0 ? 100 : 0
    };
  } catch (error) {
    console.error('Error fetching executive summary:', error);
    throw error;
  }
}

// Get geographic distribution
export async function getGeographicDistribution() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('area_code, created_at_cloud');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetGeographicDistribution();
    }
    
    const areaStats = {};
    const areaTrends = {};
    
    patients.forEach(patient => {
      const area = patient.area_code || 'Unknown';
      areaStats[area] = (areaStats[area] || 0) + 1;
      
      if (!areaTrends[area]) {
        areaTrends[area] = [];
      }
      if (patient.created_at_cloud) {
        areaTrends[area].push(new Date(patient.created_at_cloud));
      }
    });
    
    // Calculate monthly trends for each area
    const monthlyTrends = {};
    Object.keys(areaTrends).forEach(area => {
      const dates = areaTrends[area];
      const monthly = {};
      dates.forEach(date => {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthly[monthKey] = (monthly[monthKey] || 0) + 1;
      });
      monthlyTrends[area] = monthly;
    });
    
    return {
      areaStats,
      monthlyTrends,
      totalPatients: patients.length
    };
  } catch (error) {
    console.error('Error fetching geographic distribution:', error);
    throw error;
  }
}

// Get demographics overview
export async function getDemographicsOverview() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('age, gender, area_code');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetDemographicsOverview();
    }
    
    // Age distribution
    const ageGroups = {
      '0-5': 0, '6-12': 0, '13-18': 0, '19-30': 0, '31-50': 0, '50+': 0
    };
    
    // Gender distribution
    const genderStats = { male: 0, female: 0 };
    
    patients.forEach(patient => {
      const age = patient.age || 0;
      if (age <= 5) ageGroups['0-5']++;
      else if (age <= 12) ageGroups['6-12']++;
      else if (age <= 18) ageGroups['13-18']++;
      else if (age <= 30) ageGroups['19-30']++;
      else if (age <= 50) ageGroups['31-50']++;
      else ageGroups['50+']++;
      
      if (patient.gender) {
        genderStats[patient.gender.toLowerCase()]++;
      }
    });
    
    return {
      ageDistribution: ageGroups,
      genderDistribution: genderStats,
      totalPatients: patients.length
    };
  } catch (error) {
    console.error('Error fetching demographics:', error);
    throw error;
  }
}

// Get health metrics
export async function getHealthMetrics() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('medical_condition, age, created_at_cloud');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetHealthMetrics();
    }
    
    // Common conditions
    const conditions = {};
    patients.forEach(patient => {
      if (patient.medical_condition) {
        conditions[patient.medical_condition] = (conditions[patient.medical_condition] || 0) + 1;
      }
    });
    
    const topConditions = Object.entries(conditions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([condition, count]) => ({ condition, count }));
    
    // Emergency cases (patients created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const emergencyCases = patients.filter(p => 
      p.created_at_cloud && new Date(p.created_at_cloud) >= thirtyDaysAgo
    ).length;
    
    return {
      topConditions,
      emergencyCases,
      totalPatients: patients.length
    };
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    throw error;
  }
}

// Get operational analytics
export async function getOperationalAnalytics() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('device_id, created_at_cloud, area_code');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetOperationalAnalytics();
    }
    
    // Device usage
    const deviceUsage = {};
    patients.forEach(patient => {
      const device = patient.device_id || 'Unknown';
      deviceUsage[device] = (deviceUsage[device] || 0) + 1;
    });
    
    // Peak hours analysis
    const hourlyDistribution = {};
    patients.forEach(patient => {
      if (patient.created_at_cloud) {
        const hour = new Date(patient.created_at_cloud).getHours();
        hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      }
    });
    
    // Busy days analysis
    const dailyDistribution = {};
    patients.forEach(patient => {
      if (patient.created_at_cloud) {
        const day = new Date(patient.created_at_cloud).getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        dailyDistribution[dayNames[day]] = (dailyDistribution[dayNames[day]] || 0) + 1;
      }
    });
    
    return {
      deviceUsage,
      hourlyDistribution,
      dailyDistribution,
      totalPatients: patients.length
    };
  } catch (error) {
    console.error('Error fetching operational analytics:', error);
    throw error;
  }
}

// Get trend analysis
export async function getTrendAnalysis() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('created_at_cloud, area_code, medical_condition');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetTrendAnalysis();
    }
    
    // Monthly growth
    const monthlyGrowth = {};
    patients.forEach(patient => {
      if (patient.created_at_cloud) {
        const date = new Date(patient.created_at_cloud);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1;
      }
    });
    
    // Seasonal patterns (by month)
    const seasonalPatterns = {};
    patients.forEach(patient => {
      if (patient.created_at_cloud) {
        const month = new Date(patient.created_at_cloud).getMonth();
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        seasonalPatterns[monthNames[month]] = (seasonalPatterns[monthNames[month]] || 0) + 1;
      }
    });
    
    return {
      monthlyGrowth,
      seasonalPatterns,
      totalPatients: patients.length
    };
  } catch (error) {
    console.error('Error fetching trend analysis:', error);
    throw error;
  }
}

// Get recent activity
export async function getRecentActivity(limit = 10) {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('name, area_code, created_at_cloud, medical_condition')
      .order('created_at_cloud', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetRecentActivity(limit);
    }
    
    return patients.map(patient => ({
      ...patient,
      created_at_cloud: patient.created_at_cloud ? new Date(patient.created_at_cloud) : null
    }));
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

// Get sync status
export async function getSyncStatus() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('cloud_sync_status');
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetSyncStatus();
    }
    
    const synced = patients.filter(p => p.cloud_sync_status === 'synced').length;
    const pending = patients.filter(p => p.cloud_sync_status === 'pending').length;
    const failed = patients.filter(p => p.cloud_sync_status === 'failed').length;
    
    return {
      synced,
      pending,
      failed,
      total: patients.length,
      syncRate: patients.length > 0 ? (synced / patients.length * 100).toFixed(1) : '0.0'
    };
  } catch (error) {
    console.error('Error fetching sync status:', error);
    throw error;
  }
}

// Get all patients data
export async function getAllPatients() {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at_cloud', { ascending: false });
    
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message);
      return mockGetAllPatients();
    }
    
    return patients.map(patient => ({
      ...patient,
      created_at_cloud: patient.created_at_cloud ? new Date(patient.created_at_cloud) : null,
      updated_at_cloud: patient.updated_at_cloud ? new Date(patient.updated_at_cloud) : null
    }));
  } catch (error) {
    console.error('Error fetching all patients:', error);
    throw error;
  }
} 