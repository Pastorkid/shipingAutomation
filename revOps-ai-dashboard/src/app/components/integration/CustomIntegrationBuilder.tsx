'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Database, 
  Globe, 
  FileSpreadsheet, 
  Upload, 
  Key, 
  Link, 
  RefreshCw,
  Plus,
  X,
  Settings,
  Cloud,
  Shield,
  Brain,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface CustomIntegrationData {
  toolName: string;
  category: string;
  description: string;
  integrationType: string;
  connectionConfig: Record<string, any>;
  fieldMapping: Record<string, string>;
  syncSettings: string;
}

const INTEGRATION_TYPES = [
  {
    id: 'rest_api',
    name: 'REST API',
    description: 'Connect to any RESTful API with authentication',
    icon: Globe,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Receive real-time data from external systems',
    icon: Link,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Direct database connection for bulk data',
    icon: Database,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'csv_upload',
    name: 'CSV Upload',
    description: 'Upload CSV files for one-time or periodic imports',
    icon: FileSpreadsheet,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'google_sheet',
    name: 'Google Sheet',
    description: 'Connect Google Sheets for live data sync',
    icon: FileSpreadsheet,
    color: 'from-green-600 to-teal-600'
  },
  {
    id: 'manual_entry',
    name: 'Manual Entry',
    description: 'Manually enter data when automated options aren\'t available',
    icon: Plus,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'scheduled_import',
    name: 'Scheduled Import',
    description: 'Automatically import data on a schedule',
    icon: RefreshCw,
    color: 'from-cyan-500 to-blue-600'
  }
];

const CATEGORIES = [
  'CRM', 'Sales', 'Finance', 'Inventory', 'Marketing', 'Analytics', 'E-commerce', 'Other'
];

const INTERNAL_FIELDS = [
  { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-green-600' },
  { key: 'customer', label: 'Customer', icon: Users, color: 'text-blue-600' },
  { key: 'product', label: 'Product', icon: ShoppingCart, color: 'text-purple-600' },
  { key: 'order', label: 'Order', icon: ShoppingCart, color: 'text-orange-600' },
  { key: 'invoice', label: 'Invoice', icon: FileSpreadsheet, color: 'text-red-600' },
  { key: 'expense', label: 'Expense', icon: TrendingUp, color: 'text-red-500' },
  { key: 'lead', label: 'Lead', icon: Users, color: 'text-cyan-600' },
  { key: 'conversion', label: 'Conversion', icon: TrendingUp, color: 'text-green-500' },
  { key: 'subscription', label: 'Subscription', icon: RefreshCw, color: 'text-indigo-600' }
];

const SYNC_OPTIONS = [
  { id: 'realtime', label: 'Real-time', description: 'Instant data sync' },
  { id: 'hourly', label: 'Hourly', description: 'Every hour' },
  { id: 'daily', label: 'Daily', description: 'Once per day' },
  { id: 'manual', label: 'Manual', description: 'Sync on demand' }
];

interface CustomIntegrationBuilderProps {
  onComplete: (integration: CustomIntegrationData) => void;
  onCancel: () => void;
}

export default function CustomIntegrationBuilder({ onComplete, onCancel }: CustomIntegrationBuilderProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [integrationData, setIntegrationData] = useState<CustomIntegrationData>({
    toolName: '',
    category: '',
    description: '',
    integrationType: '',
    connectionConfig: {},
    fieldMapping: {},
    syncSettings: 'manual'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [externalFields, setExternalFields] = useState<string[]>([]);

  const totalSteps = 7;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleTestConnection = useCallback(async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate connection testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success (in real app, this would be an actual API call)
    setTestResult('success');
    setIsTesting(false);
    
    // Simulate discovering external fields
    setExternalFields([
      'total_price', 'email', 'order_id', 'created_at', 'customer_name', 
      'product_name', 'quantity', 'status', 'payment_method', 'shipping_address'
    ]);
  }, []);

  const handleDragStart = (field: string) => {
    setDraggedField(field);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, internalField: string) => {
    e.preventDefault();
    if (draggedField) {
      setIntegrationData(prev => ({
        ...prev,
        fieldMapping: {
          ...prev.fieldMapping,
          [draggedField]: internalField
        }
      }));
      setDraggedField(null);
    }
  };

  const handleComplete = useCallback(() => {
    onComplete(integrationData);
  }, [integrationData, onComplete]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ToolIdentity data={integrationData} onChange={setIntegrationData} />;
      case 2:
        return <Step2IntegrationType data={integrationData} onChange={setIntegrationData} />;
      case 3:
        return (
          <Step3ConnectionConfiguration 
            data={integrationData} 
            onChange={setIntegrationData}
            onTest={handleTestConnection}
            isTesting={isTesting}
            testResult={testResult}
          />
        );
      case 4:
        return (
          <Step4FieldMapping 
            data={integrationData} 
            onChange={setIntegrationData}
            externalFields={externalFields}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            draggedField={draggedField}
          />
        );
      case 5:
        return <Step5SyncSettings data={integrationData} onChange={setIntegrationData} />;
      case 6:
        return <Step6AIUnderstanding />;
      case 7:
        return <Step7Success data={integrationData} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add Custom Tool Integration
          </h1>
          <p className="text-gray-600">
            Connect any system your business uses to unlock AI-powered insights
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex items-center ${i < totalSteps - 1 ? 'flex-1' : ''}`}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    i + 1 <= currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {i + 1 <= currentStep ? <Check className="w-5 h-5" /> : i + 1}
                </motion.div>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                    i + 1 < currentStep ? 'bg-linear-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Tool Identity</span>
            <span>Integration Type</span>
            <span>Connection</span>
            <span>Data Mapping</span>
            <span>Sync Settings</span>
            <span>AI Learning</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={currentStep === 1 ? onCancel : handleBack}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={currentStep === totalSteps ? handleComplete : handleNext}
            disabled={currentStep === 3 && testResult !== 'success'}
            className="flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 25%, #6366F1 50%, #8B5CF6 75%, #7C3AED 100%)'
            }}
          >
            <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next Step'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Step Components
function Step1ToolIdentity({ data, onChange }: { data: CustomIntegrationData; onChange: (data: CustomIntegrationData) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tool Identity</h2>
        <p className="text-gray-600">Tell us about the tool you want to connect</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tool Name *</label>
          <input
            type="text"
            value={data.toolName}
            onChange={(e) => onChange({ ...data, toolName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="e.g., Salesforce, Custom CRM"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
          <select
            value={data.category}
            onChange={(e) => onChange({ ...data, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="">Select category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
          rows={3}
          placeholder="Describe what this tool does and how it fits into your business..."
        />
      </div>
    </div>
  );
}

function Step2IntegrationType({ data, onChange }: { data: CustomIntegrationData; onChange: (data: CustomIntegrationData) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integration Type</h2>
        <p className="text-gray-600">How does data from this tool enter RevOps AI?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATION_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ ...data, integrationType: type.id })}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                data.integrationType === type.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${type.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
                {data.integrationType === type.id && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Step3ConnectionConfiguration({ 
  data, 
  onChange, 
  onTest, 
  isTesting, 
  testResult 
}: {
  data: CustomIntegrationData;
  onChange: (data: CustomIntegrationData) => void;
  onTest: () => void;
  isTesting: boolean;
  testResult: 'success' | 'error' | null;
}) {
  const renderConfigForm = () => {
    switch (data.integrationType) {
      case 'rest_api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Base URL *</label>
              <input
                type="url"
                value={data.connectionConfig.baseUrl || ''}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, baseUrl: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="https://api.example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">API Key / Token *</label>
              <input
                type="password"
                value={data.connectionConfig.apiKey || ''}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, apiKey: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your API key"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Auth Type</label>
              <select
                value={data.connectionConfig.authType || 'bearer'}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, authType: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth">OAuth</option>
                <option value="custom">Custom Header</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Test Endpoint</label>
              <input
                type="text"
                value={data.connectionConfig.testEndpoint || '/health'}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, testEndpoint: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="/health or /api/test"
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Link className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Your Webhook URL</h3>
              </div>
              <code className="block p-3 bg-white rounded-lg text-sm text-gray-700 break-all">
                https://your-app.revolutionops.ai/webhook/custom-{Date.now()}
              </code>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                value={data.connectionConfig.eventName || ''}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, eventName: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., order.created, customer.updated"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Secret Key</label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={data.connectionConfig.secretKey || ''}
                  onChange={(e) => onChange({
                    ...data,
                    connectionConfig: { ...data.connectionConfig, secretKey: e.target.value }
                  })}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Generate secure secret"
                />
                <button
                  type="button"
                  onClick={() => {
                    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    onChange({
                      ...data,
                      connectionConfig: { ...data.connectionConfig, secretKey: secret }
                    });
                  }}
                  className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Database Type</label>
              <select
                value={data.connectionConfig.dbType || ''}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, dbType: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">Select database type</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Host</label>
                <input
                  type="text"
                  value={data.connectionConfig.host || ''}
                  onChange={(e) => onChange({
                    ...data,
                    connectionConfig: { ...data.connectionConfig, host: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Port</label>
                <input
                  type="number"
                  value={data.connectionConfig.port || ''}
                  onChange={(e) => onChange({
                    ...data,
                    connectionConfig: { ...data.connectionConfig, port: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="3306"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={data.connectionConfig.username || ''}
                  onChange={(e) => onChange({
                    ...data,
                    connectionConfig: { ...data.connectionConfig, username: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="db_user"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={data.connectionConfig.password || ''}
                  onChange={(e) => onChange({
                    ...data,
                    connectionConfig: { ...data.connectionConfig, password: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Database Name</label>
              <input
                type="text"
                value={data.connectionConfig.database || ''}
                onChange={(e) => onChange({
                  ...data,
                  connectionConfig: { ...data.connectionConfig, database: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="company_db"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Configuration options will appear based on your selection</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Configuration</h2>
        <p className="text-gray-600">Enter the connection details for your integration</p>
      </div>

      {renderConfigForm()}

      {/* Test Connection Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Test Connection</h3>
            <p className="text-sm text-gray-600">Verify that your connection details work correctly</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTest}
            disabled={isTesting}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Test Connection</span>
              </>
            )}
          </motion.button>
        </div>

        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl flex items-center space-x-3 ${
              testResult === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {testResult === 'success' ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Connection successful! Ready to proceed.</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">Connection failed. Please check your credentials.</span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Step4FieldMapping({ 
  data, 
  onChange, 
  externalFields, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  draggedField 
}: {
  data: CustomIntegrationData;
  onChange: (data: CustomIntegrationData) => void;
  externalFields: string[];
  onDragStart: (field: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, field: string) => void;
  draggedField: string | null;
}) {
  const getMappedField = (internalField: string) => {
    return Object.keys(data.fieldMapping).find(key => data.fieldMapping[key] === internalField);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Mapping</h2>
        <p className="text-gray-600">Map external fields to RevOps AI business concepts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* External Fields */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>External Fields</span>
          </h3>
          <div className="space-y-2">
            {externalFields.map((field) => {
              const isMapped = Object.keys(data.fieldMapping).includes(field);
              return (
                <motion.div
                  key={field}
                  draggable={!isMapped}
                  onDragStart={() => !isMapped && onDragStart(field)}
                  whileHover={!isMapped ? { scale: 1.02 } : {}}
                  className={`p-3 rounded-xl border-2 cursor-move transition-all duration-300 ${
                    isMapped 
                      ? 'border-gray-200 bg-gray-50 opacity-50' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  } ${draggedField === field ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isMapped ? 'text-gray-500' : 'text-gray-900'}`}>
                      {field}
                    </span>
                    {isMapped && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Internal Fields */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>RevOps AI Fields</span>
          </h3>
          <div className="space-y-2">
            {INTERNAL_FIELDS.map((field) => {
              const Icon = field.icon;
              const mappedExternalField = getMappedField(field.key);
              
              return (
                <motion.div
                  key={field.key}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, field.key)}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    mappedExternalField
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${field.color}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{field.label}</div>
                      {mappedExternalField ? (
                        <div className="text-sm text-purple-600 mt-1">
                          Mapped from: <code className="bg-purple-100 px-1 rounded">{mappedExternalField}</code>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 mt-1">
                          Drag an external field here
                        </div>
                      )}
                    </div>
                    {mappedExternalField && (
                      <button
                        onClick={() => {
                          const newMapping = { ...data.fieldMapping };
                          delete newMapping[mappedExternalField];
                          onChange({ ...data, fieldMapping: newMapping });
                        }}
                        className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-purple-600" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Drag external fields from the left to the corresponding RevOps AI fields on the right. 
            This mapping enables our AI to understand your business data and provide accurate insights.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step5SyncSettings({ data, onChange }: { data: CustomIntegrationData; onChange: (data: CustomIntegrationData) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sync Settings</h2>
        <p className="text-gray-600">Choose how often RevOps AI should sync data from this tool</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SYNC_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ ...data, syncSettings: option.id })}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              data.syncSettings === option.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{option.label}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              {data.syncSettings === option.id && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>Recommendation:</strong> Real-time sync provides the most accurate AI insights but may use more API calls. 
            Consider your tool's API limits and business needs.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step6AIUnderstanding() {
  const [isLearning, setIsLearning] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  React.useEffect(() => {
    const steps = [
      'Analyzing data structure...',
      'Identifying business patterns...',
      'Learning customer behavior...',
      'Detecting revenue streams...',
      'Building AI models...'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setTimeout(() => setIsLearning(false), 500);
        }
      }, (index + 1) * 800);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Understanding</h2>
        <p className="text-gray-600">RevOps AI is learning how this tool affects your business...</p>
      </div>

      <div className="space-y-4">
        {[
          { text: 'Sales data detected', icon: TrendingUp, delay: 0 },
          { text: 'Customer lifecycle identified', icon: Users, delay: 200 },
          { text: 'Revenue streams mapped', icon: DollarSign, delay: 400 },
          { text: 'Growth patterns analyzed', icon: Brain, delay: 600 }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay / 1000 }}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <item.icon className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{item.text}</span>
            <Check className="w-5 h-5 text-green-600 ml-auto" />
          </motion.div>
        ))}
      </div>

      {isLearning && (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-gray-600">AI is learning your business patterns...</p>
        </div>
      )}

      {!isLearning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI Learning Complete!</h3>
          <p className="text-gray-600">RevOps AI now understands your business data and is ready to provide insights.</p>
        </motion.div>
      )}
    </div>
  );
}

function Step7Success({ data }: { data: CustomIntegrationData }) {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Integration Complete!</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your custom tool <strong>{data.toolName}</strong> has been successfully connected to RevOps AI. 
          Data will start flowing according to your sync settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-blue-50 rounded-xl"
        >
          <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Data Connected</h3>
          <p className="text-sm text-gray-600 mt-1">Your tool is now integrated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-green-50 rounded-xl"
        >
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">AI Insights Ready</h3>
          <p className="text-sm text-gray-600 mt-1">Analysis will begin soon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-purple-50 rounded-xl"
        >
          <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Automation Active</h3>
          <p className="text-sm text-gray-600 mt-1">Syncing as configured</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
      >
        <p className="text-sm text-blue-800">
          <strong>Next Steps:</strong> Visit your dashboard to see AI-powered insights and analytics from your connected tool.
        </p>
      </motion.div>
    </div>
  );
}
