// Mock data for testing when Supabase is not connected
export const mockPatients = [
  {
    id: '1',
    unique_id: 'PAT001',
    name: 'Ahmed Hassan',
    age: 25,
    gender: 'male',
    medical_condition: 'Hypertension',
    area_code: 'GAZA_CITY',
    device_id: 'DEVICE_001',
    created_at_cloud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at_cloud: new Date().toISOString(),
    cloud_sync_status: 'synced'
  },
  {
    id: '2',
    unique_id: 'PAT002',
    name: 'Fatima Ali',
    age: 32,
    gender: 'female',
    medical_condition: 'Diabetes',
    area_code: 'KHAN_YUNIS',
    device_id: 'DEVICE_002',
    created_at_cloud: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at_cloud: new Date().toISOString(),
    cloud_sync_status: 'synced'
  },
  {
    id: '3',
    unique_id: 'PAT003',
    name: 'Mohammed Omar',
    age: 45,
    gender: 'male',
    medical_condition: 'Asthma',
    area_code: 'RAFAH',
    device_id: 'DEVICE_001',
    created_at_cloud: new Date().toISOString(),
    updated_at_cloud: new Date().toISOString(),
    cloud_sync_status: 'pending'
  },
  {
    id: '4',
    unique_id: 'PAT004',
    name: 'Aisha Khalil',
    age: 28,
    gender: 'female',
    medical_condition: 'Hypertension',
    area_code: 'GAZA_CITY',
    device_id: 'DEVICE_003',
    created_at_cloud: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at_cloud: new Date().toISOString(),
    cloud_sync_status: 'synced'
  },
  {
    id: '5',
    unique_id: 'PAT005',
    name: 'Yusuf Ibrahim',
    age: 19,
    gender: 'male',
    medical_condition: 'Injury',
    area_code: 'GAZA_NORTH',
    device_id: 'DEVICE_002',
    created_at_cloud: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at_cloud: new Date().toISOString(),
    cloud_sync_status: 'synced'
  }
];

// Mock service functions
export const mockGetExecutiveSummary = () => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  const totalPatients = mockPatients.length;
  const activeThisMonth = mockPatients.filter(p => 
    new Date(p.created_at_cloud) >= thisMonth
  ).length;
  const activeLastMonth = mockPatients.filter(p => 
    new Date(p.created_at_cloud) >= lastMonth && 
    new Date(p.created_at_cloud) < thisMonth
  ).length;
  
  const syncedCount = mockPatients.filter(p => p.cloud_sync_status === 'synced').length;
  const dataCompleteness = mockPatients.length > 0 ? 
    (mockPatients.filter(p => p.name && p.age && p.gender).length / mockPatients.length * 100).toFixed(1) : 0;
  
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
};

export const mockGetSyncStatus = () => {
  const synced = mockPatients.filter(p => p.cloud_sync_status === 'synced').length;
  const pending = mockPatients.filter(p => p.cloud_sync_status === 'pending').length;
  const failed = mockPatients.filter(p => p.cloud_sync_status === 'failed').length;
  
  return {
    synced,
    pending,
    failed,
    total: mockPatients.length,
    syncRate: mockPatients.length > 0 ? (synced / mockPatients.length * 100).toFixed(1) : '0.0'
  };
};

export const mockGetGeographicDistribution = () => {
  const areaStats = {};
  const areaTrends = {};
  
  mockPatients.forEach(patient => {
    const area = patient.area_code || 'Unknown';
    areaStats[area] = (areaStats[area] || 0) + 1;
    
    if (!areaTrends[area]) {
      areaTrends[area] = [];
    }
    if (patient.created_at_cloud) {
      areaTrends[area].push(new Date(patient.created_at_cloud));
    }
  });
  
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
    totalPatients: mockPatients.length
  };
};

export const mockGetDemographicsOverview = () => {
  const ageGroups = {
    '0-5': 0, '6-12': 0, '13-18': 0, '19-30': 0, '31-50': 0, '50+': 0
  };
  
  const genderStats = { male: 0, female: 0 };
  
  mockPatients.forEach(patient => {
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
    totalPatients: mockPatients.length
  };
};

export const mockGetHealthMetrics = () => {
  const conditions = {};
  mockPatients.forEach(patient => {
    if (patient.medical_condition) {
      conditions[patient.medical_condition] = (conditions[patient.medical_condition] || 0) + 1;
    }
  });
  
  const topConditions = Object.entries(conditions)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([condition, count]) => ({ condition, count }));
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const emergencyCases = mockPatients.filter(p => 
    p.created_at_cloud && new Date(p.created_at_cloud) >= thirtyDaysAgo
  ).length;
  
  return {
    topConditions,
    emergencyCases,
    totalPatients: mockPatients.length
  };
};

export const mockGetOperationalAnalytics = () => {
  const deviceUsage = {};
  const hourlyDistribution = {};
  const dailyDistribution = {};
  
  mockPatients.forEach(patient => {
    const device = patient.device_id || 'Unknown';
    deviceUsage[device] = (deviceUsage[device] || 0) + 1;
    
    if (patient.created_at_cloud) {
      const hour = new Date(patient.created_at_cloud).getHours();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      
      const day = new Date(patient.created_at_cloud).getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dailyDistribution[dayNames[day]] = (dailyDistribution[dayNames[day]] || 0) + 1;
    }
  });
  
  return {
    deviceUsage,
    hourlyDistribution,
    dailyDistribution,
    totalPatients: mockPatients.length
  };
};

export const mockGetTrendAnalysis = () => {
  const monthlyGrowth = {};
  const seasonalPatterns = {};
  
  mockPatients.forEach(patient => {
    if (patient.created_at_cloud) {
      const date = new Date(patient.created_at_cloud);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1;
      
      const month = date.getMonth();
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
    totalPatients: mockPatients.length
  };
};

export const mockGetRecentActivity = () => {
  return mockPatients
    .sort((a, b) => new Date(b.created_at_cloud) - new Date(a.created_at_cloud))
    .slice(0, 10)
    .map(patient => ({
      ...patient,
      created_at_cloud: new Date(patient.created_at_cloud)
    }));
};

export const mockGetAllPatients = () => {
  return mockPatients
    .sort((a, b) => new Date(b.created_at_cloud) - new Date(a.created_at_cloud))
    .map(patient => ({
      ...patient,
      created_at_cloud: new Date(patient.created_at_cloud),
      updated_at_cloud: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
}; 