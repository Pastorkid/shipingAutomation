'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Calendar,
  Bell,
  Search,
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { DateTime } from 'luxon';
import LanguageSelector from '../components/LanguageSelector';
import TrialBanner from '../components/TrialBanner';
import SubscriptionGuard from '../components/SubscriptionGuard';
import { useTranslation } from '../hooks/useTranslation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Transaction {
  id: string;
  user: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  email: string;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Use global translations
  const { t } = useTranslation();
  const router = useRouter();
  
  // Get timezone from store
  const [timeZone, setTimeZone] = useState('America/New_York');
  
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const initializeTimezone = async () => {
      try {
        const store = await import('../store/languageTimeZone/languageTimeZoneStore');
        const languageStore = store.default;
        setTimeZone(languageStore.getState().timeZone || 'America/New_York');
        
        unsubscribe = languageStore.subscribe((state: any) => {
          setTimeZone(state.timeZone || 'America/New_York');
        });
      } catch (error) {
        console.warn('Timezone store not available, using default:', error);
      }
    };
    
    initializeTimezone();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Mock data
  const [stats] = useState([
    { label: t.revenueForecast, value: '$82,000', change: 12.5, trend: 'up', color: '#3B82F6', icon: TrendingUp },
    { label: t.customerLifetimeValue, value: '$1,250', change: 8.2, trend: 'up', color: '#10B981', icon: Users },
    { label: t.churnRiskScore, value: '2.4%', change: -2.4, trend: 'down', color: '#F59E0B', icon: TrendingUp },
    { label: t.activeSubscriptions, value: '1,234', change: 5.1, trend: 'up', color: '#8B5CF6', icon: DollarSign },
    { label: t.customerAcquisitionCost, value: '$45', change: -5.3, trend: 'down', color: '#EF4444', icon: ShoppingCart },
    { label: t.profitMargin, value: '23.5%', change: 3.2, trend: 'up', color: '#10B981', icon: TrendingUp },
    { label: t.refundRate, value: '1.2%', change: -0.8, trend: 'down', color: '#F59E0B', icon: TrendingUp },
    { label: t.salesPipeline, value: '$125,000', change: 8.7, trend: 'up', color: '#3B82F6', icon: TrendingUp },
  ]);

  // Integration health data
  const [integrationHealth] = useState([
    { name: 'Stripe', status: 'connected', lastSync: '5 min ago', color: '#10B981' },
    { name: 'Shopify', status: 'sync_error', lastSync: '2 hours ago', color: '#EF4444' },
    { name: 'Custom CRM', status: 'processing', lastSync: 'Syncing...', color: '#F59E0B' },
    { name: 'Google Sheets', status: 'active', lastSync: '1 min ago', color: '#10B981' }
  ]);

  // AI Insights data
  const [aiInsights] = useState([
    { type: 'warning', message: 'Revenue dropped 12% this week', icon: '⚠️' },
    { type: 'positive', message: 'Conversion improving from email channel', icon: '📈' },
    { type: 'trending', message: 'Product X trending up 45%', icon: '🔥' },
    { type: 'forecast', message: 'Predicted revenue next month: $82,000', icon: '💰' },
    { type: 'alert', message: 'Unusual transaction spike detected', icon: '🚨' }
  ]);

  // Data readiness indicator
  const [dataReadiness] = useState([
    { area: 'Revenue model', progress: 90, status: 'complete' },
    { area: 'Customer lifecycle', progress: 75, status: 'good' },
    { area: 'Sales funnel', progress: 45, status: 'incomplete' }
  ]);

  // Chart data - must be declared before allCharts
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Profit',
        data: [8000, 12000, 10000, 18000, 15000, 22000],
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const userActivityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [320, 402, 365, 412, 389, 298, 245],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
      },
    ]
  };

  // Additional chart data needed for the charts - must be declared before allCharts
  const revenueByProductData = {
    labels: ['Product X', 'Product Y', 'Product Z', 'Product A', 'Product B'],
    datasets: [{
      label: 'Revenue by Product',
      data: [45000, 32000, 28000, 15000, 12000],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
    }]
  };

  const revenueByChannelData = {
    labels: ['Email', 'Social', 'Direct', 'Organic', 'Referral'],
    datasets: [{
      label: 'Revenue by Channel',
      data: [35000, 28000, 22000, 18000, 12000],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
    }]
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'User Growth',
      data: [1200, 1450, 1680, 1920, 2150, 2400],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const churnData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Customer Churn %',
      data: [3.2, 2.8, 3.5, 2.9, 2.4, 2.1],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4
    }]
  };

  // Additional chart data for enterprise dashboard
  const [visibleCharts, setVisibleCharts] = useState(3); // Start with 3 charts
  const [showAllCharts, setShowAllCharts] = useState(false);
  
  // All 10 charts data
  const allCharts = [
    {
      id: 1,
      title: t.revenueTrendOverTime,
      type: 'line',
      data: revenueChartData,
      alwaysVisible: true
    },
    {
      id: 2,
      title: t.userActivity2,
      type: 'bar',
      data: userActivityChartData,
      alwaysVisible: true
    },
    {
      id: 3,
      title: t.revenueByProduct,
      type: 'bar',
      data: revenueByProductData,
      alwaysVisible: false
    },
    {
      id: 4,
      title: t.revenueByChannel,
      type: 'pie',
      data: revenueByChannelData,
      alwaysVisible: false
    },
    {
      id: 5,
      title: t.userGrowthTrend,
      type: 'line',
      data: userGrowthData,
      alwaysVisible: false
    },
    {
      id: 6,
      title: t.customerChurnTrend,
      type: 'line',
      data: churnData,
      alwaysVisible: false
    },
    {
      id: 7,
      title: t.profitVsExpenses,
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Profit',
            data: [12000, 15000, 18000, 22000, 25000, 28000],
            backgroundColor: '#10B981'
          },
          {
            label: 'Expenses',
            data: [8000, 9000, 11000, 13000, 14000, 15000],
            backgroundColor: '#EF4444'
          }
        ]
      },
      alwaysVisible: false
    },
    {
      id: 8,
      title: t.funnelConversionStages,
      type: 'bar',
      data: {
        labels: ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase'],
        datasets: [{
          label: 'Conversion Rate %',
          data: [100, 75, 45, 25, 12],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
        }]
      },
      alwaysVisible: false
    },
    {
      id: 9,
      title: t.ordersPerDay,
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Orders',
          data: [45, 52, 48, 58, 65, 42, 38],
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4
        }]
      },
      alwaysVisible: false
    },
    {
      id: 10,
      title: t.forecastVsActualRevenue,
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Forecast',
            data: [30000, 32000, 35000, 38000, 40000, 42000],
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderDash: [5, 5],
            tension: 0.4
          },
          {
            label: 'Actual',
            data: [28000, 31000, 33000, 36000, 39000, 41000],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }
        ]
      },
      alwaysVisible: false
    }
  ];

  const handleShowMore = () => {
    if (visibleCharts < 10) {
      setVisibleCharts(prev => Math.min(prev + 2, 10));
    }
    if (visibleCharts + 2 >= 10) {
      setShowAllCharts(true);
    }
  };

  const handleShowLess = () => {
    setVisibleCharts(3);
    setShowAllCharts(false);
  };
  const [trialStartDate] = useState(() => {
    const stored = localStorage.getItem('trialStartDate');
    if (stored) return stored;
    
    // Start trial now if not already started
    const now = new Date().toISOString();
    localStorage.setItem('trialStartDate', now);
    return now;
  });

  const [transactions] = useState<Transaction[]>([
    { id: '1', user: 'John Doe', amount: 299, status: 'completed', date: '2024-01-15', email: 'john@example.com' },
    { id: '2', user: 'Jane Smith', amount: 199, status: 'completed', date: '2024-01-14', email: 'jane@example.com' },
    { id: '3', user: 'Bob Johnson', amount: 399, status: 'pending', date: '2024-01-14', email: 'bob@example.com' },
    { id: '4', user: 'Alice Brown', amount: 149, status: 'completed', date: '2024-01-13', email: 'alice@example.com' },
  ]);

  // Format date based on timezone
  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).setZone(timeZone).toLocaleString(DateTime.DATE_SHORT);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogout = () => {
    // Handle logout logic
    router.push('/login');
  };

  return (
    <SubscriptionGuard trialStartDate={trialStartDate} trialDurationDays={2}>
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-page)' }}>
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: (sidebarOpen || isLargeScreen) ? 0 : -300 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:fixed lg:inset-y-0 lg:left-0 lg:z-40"
          style={{ backgroundColor: 'var(--background-card)' }}
        >
        <div className="flex items-center justify-between p-6 border-b lg:border-b-0" style={{ borderColor: 'var(--input-border)' }}>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
            {t.dashboard}
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: BarChart3, label: 'Analytics' },
            { icon: Users, label: 'Users' },
            { icon: ShoppingCart, label: 'Orders' },
            { icon: Settings, label: 'Settings' },
          ].map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                item.active ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
              style={{ 
                backgroundColor: item.active ? 'var(--primary)' : 'transparent',
                color: item.active ? 'white' : 'var(--text-secondary)'
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Quick Actions Section */}
        <div className="px-4 pb-4">
          <div className="border-t pt-4" style={{ borderColor: 'var(--input-border)' }}>
            <h3 className="text-xs font-semibold mb-3 px-1" style={{ color: 'var(--text-secondary)' }}>
              ⚡ QUICK ACTIONS
            </h3>
            <div className="space-y-2">
              {[
                { icon: TrendingUp, label: 'Export Report', color: 'var(--primary)' },
                { icon: Settings, label: 'Fix Integration', color: 'var(--accent-orange)' },
                { icon: Users, label: 'Train AI Model', color: 'var(--accent-purple)' },
                { icon: DollarSign, label: 'Upgrade Plan', color: 'var(--accent-yellow)' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 5) * 0.1 }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg border border-dashed hover:border-solid transition-all hover:shadow-sm"
                  style={{ 
                    borderColor: action.color,
                    color: action.color,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${action.color}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <action.icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-medium text-left">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-2 sm:p-4" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}>
          <div className="flex items-center justify-between p-2 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 sm:p-2"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--text-secondary)' }} />
              </button>
              
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 max-w-xs sm:max-w-md">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--text-placeholder)' }} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full text-xs sm:text-sm"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    borderColor: 'var(--input-border)',
                    color: 'var(--input-text)'
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <LanguageSelector variant="header" />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 relative"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--text-secondary)' }} />
                  <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                </button>

                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                      <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ color: 'var(--text-heading)' }}>{t.profile}</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                      <Settings className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ color: 'var(--text-heading)' }}>{t.settings}</span>
                    </button>
                    <hr className="my-2" style={{ borderColor: 'var(--input-border)' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ color: 'var(--text-heading)' }}>{t.logout}</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6 w-full max-w-full"
          >
            {/* Trial Banner */}
            <motion.div variants={itemVariants}>
              <TrialBanner trialStartDate={trialStartDate} trialDurationDays={2} />
            </motion.div>

            {/* 1. CONNECTED BUSINESS STATUS */}
            <motion.div variants={itemVariants} className="px-2 sm:px-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  🧭 {t.integrationHealth}
                </h2>
                <button className="text-xs sm:text-sm font-medium hover:underline px-3 py-1 rounded-lg border" 
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  👉 {t.manageIntegrations}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {integrationHealth.map((integration, index) => (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: integration.color }}></div>
                      <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>
                        {integration.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-heading)' }}>
                      {integration.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {integration.lastSync}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 2. AI BUSINESS INSIGHTS */}
            <motion.div variants={itemVariants} className="px-2 sm:px-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  🧠 {t.aiBusinessInsights}
                </h2>
                <button className="text-xs sm:text-sm font-medium hover:underline px-3 py-1 rounded-lg border" 
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  👉 {t.viewFullAiAnalysis}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">{insight.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 10. PERSONALIZED BUSINESS SUMMARY */}
            <motion.div variants={itemVariants} className="px-2 sm:px-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.personalizedBusinessSummary}
              </h1>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                AI-powered analysis shows revenue opportunities in email channel optimization and product X expansion.
              </p>
            </motion.div>

            {/* 3. ADVANCED KPI COMMAND CENTER */}
            <motion.div variants={itemVariants} className="px-2 sm:px-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  💰 {t.advancedKpiCommandCenter}
                </h2>
                <button className="text-xs sm:text-sm font-medium hover:underline px-3 py-1 rounded-lg border" 
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  {t.customizeKpis}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {stats.map((stat: any, index: number) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border hover:shadow-md transition-shadow cursor-pointer"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: stat.color }} />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-1 rounded-full ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.trend === 'up' ? '+' : ''}{stat.change}%
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                      {stat.value}
                    </h3>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 4. EXPANDABLE ANALYTICS VISUALIZATION CENTER */}
            <motion.div variants={itemVariants} className="px-2 sm:px-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  📊 {t.analyticsVisualizationCenter} ({visibleCharts}/10 {t.chartsLoaded})
                </h2>
                <button 
                  onClick={showAllCharts ? handleShowLess : handleShowMore}
                  className="text-xs sm:text-sm font-medium hover:underline px-3 py-1 rounded-lg border" 
                  style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                >
                  {showAllCharts ? t.showLess : `${t.showMore} (${10 - visibleCharts} ${t.remaining})`}
                </button>
              </div>
              
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {allCharts.slice(0, visibleCharts).map((chart, index) => (
                  <motion.div
                    key={chart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-heading)' }}>
                      {chart.title}
                    </h3>
                    <div className="h-40 sm:h-48 lg:h-64">
                      {chart.type === 'line' && <Line data={chart.data} options={chartOptions} />}
                      {chart.type === 'bar' && <Bar data={chart.data} options={chartOptions} />}
                      {chart.type === 'pie' && <Pie data={chart.data} options={chartOptions} />}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show More Progress Indicator */}
              {visibleCharts < 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center"
                >
                  <div className="inline-flex items-center space-x-2 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(visibleCharts / 10) * 100}%`,
                          backgroundColor: 'var(--primary)'
                        }}
                      ></div>
                    </div>
                    <span>{visibleCharts} {t.of2} 10 {t.chartsLoaded}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* 5. OPERATIONS & ACTIVITY CENTER */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border"
              style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-0">
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
                  📈 {t.operationsActivityCenter}
                </h2>
                <div className="flex space-x-2">
                  {[t.transactions, t.customers, t.events, t.alerts].map((tab) => (
                    <button
                      key={tab}
                      className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                      style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)' }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                <table className="w-full min-w-75 sm:min-w-100">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--input-border)' }}>
                      <th className="text-left py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Customer
                      </th>
                      <th className="text-left py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm font-medium hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>
                        Email
                      </th>
                      <th className="text-left py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Amount
                      </th>
                      <th className="text-left py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Status
                      </th>
                      <th className="text-left py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm font-medium hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction: any) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50" style={{ borderColor: 'var(--input-border)' }}>
                        <td className="py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4">
                          <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {transaction.user.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-xs sm:text-sm truncate" style={{ color: 'var(--text-heading)' }}>
                                {transaction.user}
                              </div>
                              <div className="text-xs sm:hidden" style={{ color: 'var(--text-secondary)' }}>
                                {transaction.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>
                          <span className="truncate block max-w-32">{transaction.email}</span>
                        </td>
                        <td className="py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4">
                          <span className="font-medium text-xs sm:text-sm" style={{ color: 'var(--text-heading)' }}>
                            ${transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4">
                          <span className={`text-xs px-1.5 sm:px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-1.5 sm:py-2 lg:py-3 px-1.5 sm:px-2 lg:px-4 text-xs sm:text-sm hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>
                          {transaction.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* 6. SMART QUICK ACTIONS */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border"
              style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
            >
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 px-2 sm:px-0" style={{ color: 'var(--text-heading)' }}>
                ⚡ {t.smartQuickActions}
              </h3>
              <div className="px-2 sm:px-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  {[
                    { label: t.fixFailedIntegration, icon: Settings, color: 'var(--accent-orange)' },
                    { label: t.reviewAnomaly, icon: BarChart3, color: 'var(--accent-red)' },
                    { label: t.exportRevenueReport, icon: TrendingUp, color: 'var(--primary)' },
                    { label: t.addNewDataSource, icon: ShoppingCart, color: 'var(--accent-green)' },
                    { label: t.trainAiModel, icon: Users, color: 'var(--accent-purple)' },
                    { label: t.upgradePlan2, icon: DollarSign, color: 'var(--accent-yellow)' },
                  ].map((action: any) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 p-2 sm:p-3 lg:p-4 rounded-lg border-2 border-dashed hover:border-solid transition-colors"
                      style={{ borderColor: action.color }}
                    >
                      <action.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" style={{ color: action.color }} />
                      <span className="text-xs sm:text-sm font-medium text-left truncate" style={{ color: 'var(--text-heading)' }}>
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 8. DATA READINESS INDICATOR */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border"
              style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
                  📊 {t.dataReadinessIndicator}
                </h2>
                <button className="text-xs sm:text-sm font-medium hover:underline px-3 py-1 rounded-lg border" 
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  {t.completeSetup2}
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { area: t.revenueModel, progress: 90, status: 'complete' },
                  { area: t.customerLifecycle, progress: 75, status: 'good' },
                  { area: t.salesFunnel, progress: 45, status: 'incomplete' }
                ].map((item, index) => (
                  <motion.div
                    key={item.area}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>
                        {item.area}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === 'complete' ? 'bg-green-100 text-green-800' : 
                        item.status === 'good' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${item.progress}%`,
                          backgroundColor: item.status === 'complete' ? '#10B981' : 
                                         item.status === 'good' ? '#F59E0B' : '#EF4444'
                        }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 9. RECOMMENDED AUTOMATIONS */}
            <motion.div variants={itemVariants} className="px-2 sm:px-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  🤖 {t.recommendedAutomations}
                </h2>
                <button className="text-xs sm:text-sm font-medium hover:underline px-3 py-1 rounded-lg border" 
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  {t.viewAll2}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { title: t.automateAbandonedCartEmails, description: t.recoverMoreRevenue, impact: t.high },
                  { title: t.increasePriceOfTopProduct, description: t.basedOnDemandAnalysis, impact: t.medium },
                  { title: t.reduceDiscountUsage, description: t.optimizeForHigherMargins, impact: t.medium },
                  { title: t.reengageInactiveUsers, description: t.targetAtRiskCustomers, impact: t.high }
                ].map((automation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border"
                    style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-heading)' }}>
                          {automation.title}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {automation.description}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${
                        automation.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {automation.impact}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </SubscriptionGuard>
  );
}
