'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  Plus, 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Zap,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Link,
  Trophy,
  Star,
  Rocket,
  Eye,
  Target,
  Clock,
  Sparkles,
  Gift,
  Shield,
  Gauge
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface EnhancedSetupCompleteProps {
  connectedIntegrations: string[];
  activeAutomations: string[];
  businessHealthScore: number;
  onGoToDashboard: () => void;
  onConnectMoreTools: () => void;
  onExploreTemplates: () => void;
  onActivateAutomation: (automationId: string) => void;
}

const integrationLogos: Record<string, string> = {
  'stripe': '💳',
  'quickbooks': '📊',
  'slack': '💬',
  'gmail': '📧',
  'calendly': '📅',
  'hubspot': '🎯',
  'shopify': '🛒',
  'salesforce': '☁️'
};

const mockWorkflows = [
  { id: 'lead-followup', name: 'Lead Follow-up Automation', status: 'active', impact: '+$2,800/month' },
  { id: 'cost-monitoring', name: 'Cost Monitoring Alerts', status: 'ready', impact: '$1,200/month savings' },
  { id: 'revenue-tracking', name: 'Revenue Tracking', status: 'active', impact: '+12% revenue' },
  { id: 'customer-retention', name: 'Customer Success Workflows', status: 'ready', impact: '+8% retention' }
];

const achievements = [
  { id: '1', title: 'Business Ready', description: 'Completed onboarding setup', icon: '🚀', unlocked: true },
  { id: '2', title: 'AI Automation Activated', description: 'Enabled first automation workflow', icon: '⚡', unlocked: true },
  { id: '3', title: 'Data Connected', description: 'Integrated business tools', icon: '🔗', unlocked: true },
  { id: '4', title: 'Insights Ready', description: 'AI analysis configured', icon: '🧠', unlocked: false }
];

export default function EnhancedSetupComplete({
  connectedIntegrations,
  activeAutomations,
  businessHealthScore,
  onGoToDashboard,
  onConnectMoreTools,
  onExploreTemplates,
  onActivateAutomation,
}: EnhancedSetupCompleteProps) {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(true);
  const [insightsCountdown, setInsightsCountdown] = useState(300); // 5 minutes in seconds
  const [activatedWorkflows, setActivatedWorkflows] = useState<string[]>(activeAutomations);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setInsightsCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleActivateWorkflow = (workflowId: string) => {
    setActivatedWorkflows(prev => [...prev, workflowId]);
    onActivateAutomation(workflowId);
  };

  // Mock data for recommendations using translations
  const mockRecommendations = [
    {
      id: '1',
      title: t.enableLeadFollowUpAutomation,
      description: t.startNurturingLeadsAutomatically,
      impact: t.increaseConversions,
      priority: 'high',
      actionType: 'activate',
      workflowId: 'lead-followup'
    },
    {
      id: '2',
      title: t.activateCostMonitoringLabel,
      description: t.getRealTimeAlerts,
      impact: t.unusualSpendingPatterns,
      priority: 'medium',
      actionType: 'activate',
      workflowId: 'cost-monitoring'
    },
    {
      id: '3',
      title: t.connectQuickBooks,
      description: t.syncFinancialData,
      impact: t.improvedAccuracy,
      priority: 'medium',
      actionType: 'connect',
      tool: 'quickbooks'
    }
  ];

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreTrend = () => {
    // Simulate trend based on score
    if (businessHealthScore >= 75) return 'up';
    if (businessHealthScore >= 60) return 'stable';
    return 'down';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth - window.innerWidth / 2,
                  y: -50,
                  rotate: Math.random() * 360
                }}
                animate={{ 
                  y: window.innerHeight + 50,
                  rotate: Math.random() * 720
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5
                }}
                className="absolute text-2xl"
              >
                {['🎉', '✨', '🎊', '⭐', '🏆'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center"
      >
        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <CheckCircle className="w-14 h-14 text-white drop-shadow-lg" />
          </motion.div>
          {/* Animated rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-white/30"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-white/20"
          />
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mt-8 mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
        >
          {t.setupCompleteTitle}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-gray-700 mb-3 font-medium"
        >
          {t.setupCompleteSubtitle}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          {t.setupCompleteDesc2}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200"
        >
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-700">
            Revenue Insights in {formatCountdown(insightsCountdown)}
          </span>
        </motion.div>
      </motion.div>

      {/* Interactive Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Integrations Card */}
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl border border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[280px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-900 text-lg flex-1 mr-2">{t.integrationsCount}</h3>
            <div className="relative flex-shrink-0">
              <Link className="w-6 h-6 text-emerald-600" />
              <div 
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-50"
                onMouseEnter={() => setShowTooltip('integrations')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                {t.connectedToolsSyncData}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex-shrink-0">{connectedIntegrations.length}</div>
            <div className="flex -space-x-3 flex-shrink-0">
              {connectedIntegrations.slice(0, 4).map((integration, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, z: 10 }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg border-2 border-emerald-200 shadow-md"
                >
                  {integrationLogos[integration.toLowerCase()] || '🔌'}
                </motion.div>
              ))}
              {connectedIntegrations.length > 4 && (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 border-2 border-emerald-200 shadow-md">
                  +{connectedIntegrations.length - 4}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnectMoreTools}
              className="w-full flex items-center justify-center space-x-2 px-3 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg text-sm"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              <span className="text-center leading-tight">{t.addMore}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Automations Card */}
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[280px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-blue-900 text-lg flex-1 mr-2">{t.automationsCount}</h3>
            <div className="relative flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-600" />
              <div 
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-50"
                onMouseEnter={() => setShowTooltip('automations')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                {t.workflowsRunning247}
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6 flex-1 overflow-y-auto">
            {mockWorkflows.filter(w => activatedWorkflows.includes(w.id)).map((workflow) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between text-sm p-2 bg-white/60 rounded-lg"
              >
                <span className="text-gray-700 font-medium flex-1 mr-2 truncate">{workflow.name}</span>
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0">{workflow.impact}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreTemplates}
              className="w-full flex items-center justify-center space-x-2 px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg text-sm"
            >
              <Play className="w-5 h-5 flex-shrink-0" />
              <span className="text-center leading-tight">Activate New</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Health Score Card */}
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-3xl border border-violet-200 shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[280px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-violet-900 text-lg flex-1 mr-2">{t.businessHealthScoreLabel}</h3>
            <div className="relative flex-shrink-0">
              <Gauge className="w-6 h-6 text-violet-600" />
              <div 
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-50"
                onMouseEnter={() => setShowTooltip('health')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                {t.overallBusinessPerformance}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0">{businessHealthScore}</div>
            <motion.div
              animate={{ rotate: getScoreTrend() === 'up' ? [0, 10, -10, 0] : getScoreTrend() === 'down' ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex items-center space-x-1 flex-shrink-0"
            >
              {getScoreTrend() === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
              {getScoreTrend() === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
              {getScoreTrend() === 'stable' && <Activity className="w-5 h-5 text-yellow-500" />}
            </motion.div>
          </div>
          
          <div className="w-full bg-violet-200 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${businessHealthScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          <div className={`text-sm font-bold ${getScoreColor(businessHealthScore)} bg-white/60 px-3 py-1 rounded-full text-center mt-auto`}>
            {businessHealthScore >= 80 ? 'Excellent' : businessHealthScore >= 60 ? 'Good' : 'Needs Attention'}
          </div>
        </motion.div>
      </motion.div>

      {/* AI-Driven Next Steps Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border border-indigo-200 shadow-xl"
      >
        <div className="flex items-center space-x-4 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-Recommended Next Steps</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="p-6 bg-white/80 backdrop-blur rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[320px] flex flex-col"
            >
              <div className="flex flex-col items-center space-y-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0"
                >
                  <Target className="w-5 h-5 text-indigo-600" />
                </motion.div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap flex-shrink-0 text-center ${
                  rec.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
              
              <h4 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{rec.title}</h4>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">{rec.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{rec.impact}</span>
              </div>
              
              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => rec.actionType === 'activate' ? handleActivateWorkflow(rec.workflowId!) : onConnectMoreTools()}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg text-sm"
                >
                  {rec.actionType === 'activate' ? <Play className="w-4 h-4 flex-shrink-0" /> : <Link className="w-4 h-4 flex-shrink-0" />}
                  <span className="text-center leading-tight">{rec.actionType === 'activate' ? 'Activate Now' : 'Connect Tool'}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Personalized Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -3 }}
          className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col items-center space-y-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <DollarSign className="w-6 h-6 text-white" />
            </motion.div>
            <h4 className="font-bold text-emerald-900 text-lg leading-tight text-center">Revenue Streams Detected</h4>
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 text-center">3</div>
          <p className="text-emerald-700 font-medium text-center">SaaS, Services, Products</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02, y: -3 }}
          className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col items-center space-y-3 mb-4">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <h4 className="font-bold text-blue-900 text-lg leading-tight text-center">Potential Savings</h4>
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 text-center">$1,200/month</div>
          <p className="text-blue-700 font-medium text-center">With cost monitoring</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02, y: -3 }}
          className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl border border-violet-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col items-center space-y-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <h4 className="font-bold text-violet-900 text-lg leading-tight text-center">Quick Win Automations</h4>
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">2</div>
          <p className="text-violet-700 font-medium text-center">Lead follow-up, Marketing</p>
        </motion.div>
      </motion.div>

      {/* Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl border border-gray-200 shadow-xl"
      >
        <div className="flex items-center space-x-4 mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 bg-gradient-to-br from-gray-600 to-slate-600 rounded-2xl shadow-lg"
          >
            <Eye className="w-7 h-7 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-slate-700 bg-clip-text text-transparent">Preview Your Dashboard</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mini Revenue Chart */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col"
          >
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-sm text-center">Revenue</span>
            </div>
            <div className="flex items-end space-x-2 h-20 mb-3 flex-1">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg"
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 font-medium text-center">Last 7 days</div>
          </motion.div>
          
          {/* Mini Activity Chart */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col"
          >
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex-shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-sm text-center">Activity</span>
            </div>
            <div className="w-full h-20 relative mb-3 flex-1">
              <svg className="w-full h-full">
                <motion.polyline
                  points="10,60 30,40 50,50 70,30 90,45 110,35 130,25"
                  fill="none"
                  stroke="url(#blueGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-xs text-gray-500 font-medium text-center">User engagement</div>
          </motion.div>
          
          {/* Conversion Rate */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col"
          >
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-sm text-center">Conversion</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center mb-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent text-center">23.5%</div>
              <div className="flex items-center space-x-1 mt-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                </motion.div>
                <span className="text-xs font-bold text-emerald-600">+5.2%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium text-center">Rate</div>
          </motion.div>
          
          {/* Active Users */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col"
          >
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-sm text-center">Active Users</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center mb-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">1,284</div>
              <div className="flex items-center space-x-1 mt-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                </motion.div>
                <span className="text-xs font-bold text-emerald-600">+12%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium text-center">Total users</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gamification Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border border-amber-200 shadow-xl"
      >
        <div className="flex items-center space-x-4 mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg"
          >
            <Trophy className="w-7 h-7 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Achievements Unlocked! 🏆</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.1 + index * 0.15, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 rounded-2xl text-center border-2 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-white to-amber-50 border-amber-400 shadow-xl' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 opacity-60'
              }`}
            >
              <motion.div
                animate={achievement.unlocked ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl mb-3"
              >
                {achievement.icon}
              </motion.div>
              <h4 className={`font-bold text-sm mb-2 ${
                achievement.unlocked ? 'bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent' : 'text-gray-600'
              }`}>
                {achievement.title}
              </h4>
              <p className={`text-xs mb-3 ${
                achievement.unlocked ? 'text-amber-600 font-medium' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.15, type: "spring" }}
                  className="flex items-center justify-center space-x-2"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-amber-800">Unlocked!</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Access Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-6"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoToDashboard}
          className="group flex items-center space-x-4 px-10 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Rocket className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Go to Dashboard</span>
          <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnectMoreTools}
          className="group flex items-center space-x-4 px-8 py-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:border-gray-400 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Link className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Connect More Tools</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExploreTemplates}
          className="group flex items-center space-x-4 px-8 py-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:border-gray-400 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Settings className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Explore Templates</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
