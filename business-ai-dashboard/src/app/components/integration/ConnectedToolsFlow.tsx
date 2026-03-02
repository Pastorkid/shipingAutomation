'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ArrowRight, 
  Check, 
  Zap, 
  Globe, 
  CreditCard, 
  Database, 
  ShoppingBag, 
  Users, 
  FileText,
  TrendingUp,
  Settings,
  Star,
  Shield,
  Clock,
  BarChart3
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import CustomIntegrationBuilder from './CustomIntegrationBuilder';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  isPopular?: boolean;
  isPremium?: boolean;
  color: string;
  status?: 'connected' | 'connecting' | 'disconnected';
}

interface ConnectedToolsFlowProps {
  onComplete: (connectedTools: string[]) => void;
  onBack: () => void;
}

const POPULAR_TOOLS: Tool[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    icon: CreditCard,
    category: 'Finance',
    isPopular: true,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'E-commerce platform and inventory management',
    icon: ShoppingBag,
    category: 'E-commerce',
    isPopular: true,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting and financial management',
    icon: FileText,
    category: 'Finance',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM and sales pipeline management',
    icon: Users,
    category: 'CRM',
    isPremium: true,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing, sales, and service platform',
    icon: Users,
    category: 'CRM',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Spreadsheet data and custom reports',
    icon: Database,
    category: 'Analytics',
    color: 'from-green-600 to-teal-600'
  }
];

export default function ConnectedToolsFlow({ onComplete, onBack }: ConnectedToolsFlowProps) {
  const { t } = useTranslation();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [toolStatuses, setToolStatuses] = useState<Record<string, 'connected' | 'connecting' | 'disconnected'>>({});
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customIntegrations, setCustomIntegrations] = useState<string[]>([]);

  const handleToolToggle = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleConnectTool = async (toolId: string) => {
    setToolStatuses(prev => ({ ...prev, [toolId]: 'connecting' }));
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setToolStatuses(prev => ({ ...prev, [toolId]: 'connected' }));
  };

  const handleConnectAll = async () => {
    for (const toolId of selectedTools) {
      await handleConnectTool(toolId);
    }
  };

  const handleCustomIntegrationComplete = (integration: any) => {
    setCustomIntegrations(prev => [...prev, integration.toolName]);
    setShowCustomBuilder(false);
  };

  const allConnectedTools = [
    ...selectedTools.filter(id => toolStatuses[id] === 'connected'),
    ...customIntegrations
  ];

  const isComplete = allConnectedTools.length > 0;

  if (showCustomBuilder) {
    return (
      <CustomIntegrationBuilder
        onComplete={handleCustomIntegrationComplete}
        onCancel={() => setShowCustomBuilder(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg"
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Business Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate your existing tools to unlock AI-powered insights and automation. 
            The more tools you connect, the smarter RevOps AI becomes.
          </p>
        </div>

        {/* Popular Integrations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <span>Popular Integrations</span>
              </h2>
              <p className="text-gray-600 mt-2">One-click setup for the most common business tools</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {selectedTools.length} selected
              </div>
              {selectedTools.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConnectAll}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Connect All Selected
                </motion.button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
            {POPULAR_TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              const isSelected = selectedTools.includes(tool.id);
              const status = toolStatuses[tool.id];
              
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToolToggle(tool.id)}
                  className={`relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-xl'
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Popular Badge */}
                  {tool.isPopular && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                        POPULAR
                      </div>
                    </div>
                  )}

                  {/* Premium Badge */}
                  {tool.isPremium && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                        PRO
                      </div>
                    </div>
                  )}

                  {/* Status Indicator */}
                  {status && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                      {status === 'connecting' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </motion.div>
                      )}
                      {status === 'connected' && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  )}

                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-linear-to-r ${tool.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 wrap-break-word">{tool.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                      <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                          {tool.category}
                        </span>
                        {isSelected && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium whitespace-nowrap">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connection Progress */}
                  <AnimatePresence>
                    {status === 'connecting' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 sm:mt-4"
                      >
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Connecting...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Connected State */}
                  <AnimatePresence>
                    {status === 'connected' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          <span className="text-xs sm:text-sm text-green-800 font-medium">Connected successfully!</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Custom Integration */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <span>Need Something Different?</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect any custom tool, database, or API with our Universal Integration Builder
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCustomBuilder(true)}
            className="max-w-2xl mx-auto p-8 rounded-3xl border-2 border-dashed border-purple-300 bg-linear-to-r from-purple-50 to-pink-50 cursor-pointer hover:border-purple-400 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center"
              >
                <Plus className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Add Custom Tool
              </h3>
              <p className="text-gray-600 mb-4">
                Connect any system your business uses
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>REST APIs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>Databases</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>CSV Files</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Webhooks</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connected Tools Summary */}
        {allConnectedTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Connected Tools</h3>
                <p className="text-gray-600">Your business tools are now integrated with RevOps AI</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allConnectedTools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 p-3 bg-white rounded-xl shadow-sm"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate">{tool}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span>AI Analytics Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Growth Insights Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span>Automation Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 lg:w-48 w-auto"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete(allConnectedTools)}
            disabled={!isComplete}
            className="flex items-center justify-center space-x-3 px-16 py-5 rounded-xl font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform border border-white/20 backdrop-blur-sm lg:w-56 w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isComplete 
                ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 25%, #6366F1 50%, #8B5CF6 75%, #7C3AED 100%)'
                : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
            }}
          >
            <span>{isComplete ? 'Continue to Dashboard' : 'Connect at least one tool'}</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
