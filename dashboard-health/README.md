# NGO Health Records Dashboard

A comprehensive React dashboard for NGO health operations, providing real-time insights into patient demographics, health metrics, and operational analytics in Gaza.

## 🚀 Features

### Executive Summary
- Total patients registered with trend indicators
- Active patients this month vs previous month
- Sync status with real-time monitoring
- Data completeness metrics

### Geographic Distribution
- Interactive area-wise patient distribution
- Bar charts and pie charts for visual analysis
- Monthly trend analysis by area
- Area comparison tools

### Demographics Overview
- Age distribution analysis (0-5, 6-12, 13-18, 19-30, 31-50, 50+)
- Gender distribution with ratios
- Average age calculations
- Key demographic insights

### Health Metrics Dashboard
- Top 5 common health conditions
- Emergency case tracking
- Medical condition severity analysis
- Treatment outcome metrics

### Operational Analytics
- Device usage statistics
- Peak hours and busy days analysis
- Staff performance metrics
- Resource utilization insights

### Trend Analysis
- Monthly growth patterns
- Seasonal health trends
- Predictive analytics (3-month forecast)
- Growth rate calculations

### Recent Activity
- Latest patient registrations
- Real-time activity feed
- Area-wise activity summary
- Quick patient lookup

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **UI Framework**: Material-UI (MUI) v5
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Styling**: Emotion (CSS-in-JS)
- **Date Handling**: date-fns

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Supabase Account** with configured database

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_DASHBOARD_TITLE=NGO Health Records Dashboard
   VITE_AUTO_REFRESH_INTERVAL=300000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

The dashboard requires a Supabase database with the following schema:

### Required Tables
- `patients` - Patient records
- `sync_logs` - Sync activity logs

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Click "Deploy site"

3. **Configure Environment Variables**
   In Netlify dashboard, go to Site settings > Environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_DASHBOARD_TITLE=NGO Health Records Dashboard
   VITE_AUTO_REFRESH_INTERVAL=300000
   ```

4. **Automatic Deployments**
   - Every push to main branch will trigger automatic deployment
   - Pull requests will create preview deployments

### Alternative: Manual Deployment
```bash
./deploy.sh
```
- `areas` - Geographic areas

### Database Schema
```sql
-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  medical_condition TEXT,
  area_code TEXT,
  device_id TEXT,
  created_at_cloud TIMESTAMP DEFAULT NOW(),
  updated_at_cloud TIMESTAMP DEFAULT NOW(),
  cloud_sync_status TEXT DEFAULT 'pending'
);

-- Sync logs table
CREATE TABLE sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Areas table
CREATE TABLE areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area_code TEXT UNIQUE NOT NULL,
  area_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📊 Dashboard Sections

### 1. Executive Summary
- Key performance indicators
- Real-time sync status
- Data quality metrics
- Quick stats overview

### 2. Geographic Distribution
- Interactive area selection
- Patient distribution charts
- Monthly trend analysis
- Area comparison tools

### 3. Demographics
- Age group analysis
- Gender distribution
- Average age calculations
- Demographic insights

### 4. Health Metrics
- Common conditions analysis
- Emergency case tracking
- Medical condition severity
- Health trend monitoring

### 5. Operational Analytics
- Device usage statistics
- Peak activity times
- Daily patterns
- Resource utilization

### 6. Trend Analysis
- Growth rate analysis
- Seasonal patterns
- Predictive analytics
- Forecast insights

### 7. Recent Activity
- Latest registrations
- Activity timeline
- Quick patient lookup
- Real-time updates

## 🔄 Auto-Refresh

The dashboard automatically refreshes data every 5 minutes to ensure real-time insights. Manual refresh is also available via the refresh button.

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Touch-enabled screens

## 🎨 Customization

### Theme Customization
Edit the theme in `src/App.jsx`:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    // ... other theme options
  },
});
```

### Component Customization
Each dashboard section can be customized by editing the respective component files in `src/components/`.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- Secure API key management
- HTTPS enforcement

## 📈 Performance

- Optimized bundle size
- Lazy loading for charts
- Efficient data fetching
- Smart caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check Supabase URL and API key
   - Verify internet connectivity
   - Check Supabase project status

2. **No Data Displayed**
   - Ensure database tables exist
   - Check RLS policies
   - Verify data sync status

3. **Charts Not Loading**
   - Check browser console for errors
   - Verify data format
   - Ensure Recharts is installed

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Dashboard data:', data);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review Supabase documentation
- Open an issue on GitHub

## 🔄 Updates

The dashboard is designed to work with the HealthRecordsJS Android app. Ensure both applications are using compatible data schemas.

---

**Note**: This dashboard is specifically designed for NGO health operations in Gaza and provides comprehensive insights for decision-making and resource allocation.
