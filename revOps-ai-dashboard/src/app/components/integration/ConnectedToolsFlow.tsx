'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft,
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
  BarChart3,
  Loader2,
  AlertCircle,
  ChevronRight,
  X,
  TestTube,
  RefreshCw,
  ArrowUpDown,
  PlusCircle,
  Trash2,
  Save,
  Play,
  Info
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { POPULAR_TOOLS, TOOL_CATEGORIES, AUTH_TYPES, SYNC_FREQUENCIES, REVOPS_FIELDS, COMMON_EXTERNAL_FIELDS } from '../../store/connectedTools/connectedToolsInteface';
import { useConnectedToolsStore } from '../../store/connectedTools/connectedToolsStore';
import toast from 'react-hot-toast';

interface ConnectedToolsFlowProps {
  onComplete: (connectedTools: string[]) => void;
  onBack: () => void;
}

export default function ConnectedToolsFlow({ onComplete, onBack }: ConnectedToolsFlowProps) {
  const { t } = useTranslation() as any;
  const {
    tools,
    selectedTools,
    isLoading,
    error,
    oauthState,
    uiState,
    connectTool,
    disconnectTool,
    testConnection,
    toggleToolSelection,
    setSelectedTools,
    completeToolsSetup,
    refreshTools,
    initiateOAuthConnection,
    completeOAuthConnection,
    clearOAuthState,
    setActiveView,
    addToRecentlyConnected,
    addConnectionHistory
  } = useConnectedToolsStore();

  // Multi-step flow state
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'mapping' | 'sync'>('select');
  const [customToolForm, setCustomToolForm] = useState({
    toolName: '',
    category: 'sales' as any,
    description: '',
    baseUrl: '',
    authType: 'bearer' as any,
    apiKey: '',
    testEndpoint: ''
  });
  const [showCustomToolForm, setShowCustomToolForm] = useState(false);
  const [dataMapping, setDataMapping] = useState<Array<{externalField: string, revOpsField: string}>>([]);
  const [externalFieldInput, setExternalFieldInput] = useState('');
  const [selectedRevOpsField, setSelectedRevOpsField] = useState('');
  const [showAddField, setShowAddField] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    frequency: 'manual' as any,
    isActive: true
  });
  const [customToolId, setCustomToolId] = useState<string | null>(null);

  const connectedTools = tools.filter((tool: any) => tool.status === 'connected');
  const canProceed = connectedTools.length >= 1;

  // Initialize component and handle OAuth callbacks
  useEffect(() => {
    console.log('🔄 ConnectedToolsFlow component mounted - refreshing tools');
    // Always refresh tools when component mounts to ensure latest state
    refreshTools().then(() => {
      console.log('✅ Tools refreshed after component mount');
    });
    
    // Handle OAuth callbacks from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const tool = urlParams.get('tool');
    const success = urlParams.get('success');
    
    if (tool && success) {
      console.log('🔗 OAuth callback detected:', { tool, success });
      
      if (success === 'true') {
        // Add to recently connected immediately for UI feedback
        addToRecentlyConnected(tool);
        
        // Refresh tools to get the latest connection status
        refreshTools().then(() => {
          console.log('✅ Tools refreshed after OAuth success');
          toast.success(`${tool.charAt(0).toUpperCase() + tool.slice(1)} connected successfully!`);
        });
      }
      
      // Clean up URL
      window.history.replaceState({}, '', '/onboarding');
    }
  }, [refreshTools, completeOAuthConnection, addToRecentlyConnected]);

  
  // Add external field to mapping
  const addMapping = () => {
    if (externalFieldInput && selectedRevOpsField) {
      setDataMapping(prev => [...prev, {
        externalField: externalFieldInput,
        revOpsField: selectedRevOpsField
      }]);
      setExternalFieldInput('');
      setSelectedRevOpsField('');
      toast.success('Mapping added successfully!');
    } else {
      toast.error('Please fill in both fields');
    }
  };

  // Remove mapping
  const removeMapping = (index: number) => {
    setDataMapping(prev => prev.filter((_, i) => i !== index));
    toast.success('Mapping removed');
  };

  // Test custom tool connection
  const testCustomToolConnection = async () => {
    if (!customToolForm.baseUrl || !customToolForm.testEndpoint) {
      toast.error('Please provide base URL and test endpoint');
      return;
    }

    try {
      toast.loading('Testing connection...');

      const apiUrl = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/connectTools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test-connection',
          config: customToolForm,
          testEndpoint: customToolForm.testEndpoint
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        toast.success('Connection test successful!');
        console.log('✅ Custom tool connection test result:', result.data);
      } else {
        toast.dismiss();
        toast.error(result.error || 'Connection test failed');
        console.error('❌ Connection test failed:', result.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Connection test failed');
      console.error('❌ Connection test error:', error);
    }
  };

  const handleToolSelect = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((id: string) => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const handleConnectTool = async (toolId: string) => {
    try {
      // Check if API URL is configured
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
      if (!apiUrl) {
        toast.error('API URL not configured');
        return;
      }

      // Initiate OAuth connection flow
      initiateOAuthConnection(toolId, '/onboarding');
      
      const tool = POPULAR_TOOLS.find((t: any) => t.id === toolId);
      if (!tool) {
        toast.error('Tool not found');
        return;
      }

      // Show loading state
      toast.loading(`Connecting to ${tool.name}...`, { id: 'oauth-connection' });

      // Construct OAuth URL with proper state management
      const state = `${toolId}_${Date.now()}`;
      const oauthUrls = {
        stripe: `${apiUrl}/oauth/stripe?state=${state}`,
        shopify: `${apiUrl}/oauth/shopify?state=${state}`,
        quickbooks: `${apiUrl}/oauth/quickbooks?state=${state}`,
        salesforce: `${apiUrl}/oauth/salesforce?state=${state}`,
        hubspot: `${apiUrl}/oauth/hubspot?state=${state}`,
        googlesheets: `${apiUrl}/oauth/google?state=${state}`
      };

      const oauthUrl = oauthUrls[toolId as keyof typeof oauthUrls];
      if (oauthUrl) {
        // Redirect to OAuth provider
        window.location.href = oauthUrl;
      } else {
        toast.error(`OAuth URL not configured for ${tool.name}`, { id: 'oauth-connection' });
        completeOAuthConnection(toolId, false, 'OAuth URL not configured');
      }
    } catch (error) {
      console.error('Error initiating OAuth connection:', error);
      toast.error('Failed to initiate connection', { id: 'oauth-connection' });
      completeOAuthConnection(toolId, false, 'Connection initiation failed');
    }
  };

  // Connect all selected tools
  const handleConnectSelectedTools = async () => {
    if (selectedTools.length === 0) {
      toast.error('Please select at least one tool to connect');
      return;
    }
    
    if (selectedTools.length === 1) {
      // Single tool - connect directly
      await handleConnectTool(selectedTools[0]);
    } else {
      // Multiple tools - connect first one, then queue others in store
      toast.success(`Connecting ${selectedTools.length} tools. Starting with ${selectedTools[0]}...`);
      
      // Store remaining tools in store state for sequential connection
      // This will be handled after OAuth redirect
      const remainingTools = selectedTools.slice(1);
      
      await handleConnectTool(selectedTools[0]);
    }
  };

  // Connect single tool immediately
  const handleConnectSingleTool = async (toolId: string) => {
    if (isLoading) return;
    
    try {
      await handleConnectTool(toolId);
    } catch (error) {
      // Error is already handled in handleConnectTool
    }
  };

  const handleConnectCustomTool = async () => {
    if (!customToolForm.toolName || !customToolForm.baseUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      toast.loading('Connecting custom tool...');

      const apiUrl = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/connectTools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect-custom',
          toolType: 'custom',
          config: {
            ...customToolForm,
            customHeaders: {}
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.dismiss();
        setCustomToolId(result.data.toolId);
        setCurrentStep('configure');
        toast.success('Tool connected! Now configure data mapping.');
        console.log('✅ Custom tool connected:', result.data);
      } else {
        toast.dismiss();
        toast.error(result.error || 'Failed to connect custom tool');
        console.error('❌ Custom tool connection failed:', result.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to connect custom tool');
      console.error('❌ Custom tool connection error:', error);
    }
  };

  const handleResetCustomTool = () => {
    setShowCustomToolForm(false);
    setCurrentStep('select');
    setCustomToolId(null);
    setDataMapping([]);
    setSyncSettings({ frequency: 'manual', isActive: true });
    setCustomToolForm({
      toolName: '',
      category: 'sales',
      description: '',
      baseUrl: '',
      authType: 'bearer',
      apiKey: '',
      testEndpoint: ''
    });
  };

  const handleCompleteCustomToolSetup = async () => {
    if (!customToolId) return;

    try {
      toast.loading('Saving custom tool configuration...');

      const apiUrl = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/connectTools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save-config',
          toolType: 'custom',
          toolId: customToolId,
          config: customToolForm,
          dataMapping,
          syncSettings
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('🔧 Custom tool configuration saved:', result.data);
        
        toast.dismiss();
        toast.success('Custom tool setup completed! N8N workflow created.');
        
        // Log the N8N workflow ID for production use
        if (result.data.n8nWorkflowId) {
          console.log('🔄 N8N Workflow ID:', result.data.n8nWorkflowId);
        }
        
        // Reset and go back to selection
        handleResetCustomTool();
        
        // Refresh tools list
        refreshTools();
      } else {
        toast.dismiss();
        toast.error(result.error || 'Failed to save configuration');
        console.error('❌ Configuration save failed:', result.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to save configuration');
      console.error('❌ Configuration save error:', error);
    }
  };

  const handleTestConnection = async (toolId: string) => {
    const success = await testConnection(toolId);
    if (success) {
      toast.success('Connection test successful!');
    }
  };

  const handleComplete = () => {
    if (canProceed) {
      completeToolsSetup();
      
      // Get the actual connected tool IDs from the store
      const connectedToolIds = tools
        .filter((tool: any) => tool.status === 'connected')
        .map((tool: any) => tool.id);
      
      console.log('🎯 Connected Tools Flow completed with tools:', connectedToolIds);
      onComplete(connectedToolIds);
    } else {
      toast.error('Please connect at least one tool to proceed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  } as const;

  const renderToolSelection = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="text-center">
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold mb-4"
          style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-family-heading)' }}
        >
          Connect Your Business Tools
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Select the tools you want to integrate with RevOps AI to automate your business operations
        </motion.p>
      </div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Popular Tools
          </h3>
          <motion.button
            onClick={() => refreshTools()}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ 
              borderColor: 'var(--input-border)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--background-primary)'
            }}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Select tools to connect your existing accounts. Click on tools to select multiple, then connect them all at once.
        </p>
        
        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 rounded-lg mb-4 text-xs" style={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--input-border)' }}>
            <div><strong>API URL:</strong> {process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'NOT CONFIGURED'}</div>
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <button
              onClick={() => {
                console.log('🔍 Debug Info:');
                console.log('- API URL:', process.env.NEXT_PUBLIC_SERVER_LOCAL_URL);
                console.log('- Selected Tools:', selectedTools);
                console.log('- Connected Tools:', tools);
                console.log('- Available Tools:', POPULAR_TOOLS);
              }}
              className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-xs"
            >
              Debug Console
            </button>
          </div>
        )}
        
        {/* Multi-select actions */}
        {selectedTools.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-lg border mb-6"
            style={{ 
              backgroundColor: 'var(--background-secondary)', 
              borderColor: 'var(--primary-color)' 
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                {selectedTools.length}
              </div>
              <div>
                <div className="font-medium" style={{ color: 'var(--text-heading)' }}>
                  {selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''} selected
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedTools.map(id => POPULAR_TOOLS.find(t => t.id === id)?.name).join(', ')}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTools([])}
                className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                style={{ 
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-secondary)'
                }}
              >
                Clear Selection
              </button>
              <motion.button
                onClick={handleConnectSelectedTools}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className="px-6 py-2 rounded-lg text-white font-medium text-sm flex items-center space-x-2"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Connect Selected Tools</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Recently Connected Tools Section */}
      {uiState.recentlyConnected.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900">Recently Connected</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {uiState.recentlyConnected.map((toolId) => {
                const tool = POPULAR_TOOLS.find(t => t.id === toolId);
                return tool ? (
                  <div key={toolId} className="flex items-center px-3 py-2 bg-white rounded-lg border border-green-200">
                    <span className="text-lg mr-2">{tool.icon}</span>
                    <span className="text-sm font-medium text-green-800">{tool.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </motion.div>
      )}

      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_TOOLS.map((tool: any) => {
          // Enhanced tool matching with status check
          const connectedTool = tools.find((t: any) => {
            // Check if tool is connected/active first
            const isActive = t.status === 'connected' || t.status === 'active';
            if (!isActive) return false;
            
            // Multiple matching strategies for different backend formats
            const matches = [
              t.type === tool.id,                    // 'googlesheets' === 'googlesheets'
              t.type === tool.type,                  // 'googlesheets' === 'googlesheets' 
              t.type === tool.name,                  // 'googlesheets' === 'Google Sheets'
              t.type === tool.id.toUpperCase(),      // 'GOOGLE_SHEETS' === 'GOOGLESHEETS'
              tool.id === t.type?.toLowerCase(),     // 'googlesheets' === 'google_sheets'
              tool.name?.toLowerCase() === t.type?.toLowerCase(), // 'google sheets' === 'google_sheets'
              (t as any).toolType === tool.id.toUpperCase(),  // 'GOOGLE_SHEETS' === 'GOOGLESHEETS'
              (t as any).toolType?.toLowerCase() === tool.id, // 'google_sheets' === 'googlesheets'
              (t as any).toolType?.toLowerCase() === tool.type, // 'google_sheets' === 'googlesheets'
            ];
            
            const isMatch = matches.some(match => match);
            if (isMatch && process.env.NODE_ENV === 'development') {
              console.log(`🔗 Tool Match Found: ${tool.name} matches ${t.type} (status: ${t.status})`);
            }
            return isMatch;
          });
          
          const isConnected = !!connectedTool;
          const isSelected = selectedTools.includes(tool.id);
          const isRecentlyConnected = uiState.recentlyConnected.some(recentToolId => 
            recentToolId === tool.id || 
            recentToolId === tool.type ||
            recentToolId?.toLowerCase() === tool.id?.toLowerCase()
          );
          
          // Count connected tools for display
          const connectedCount = tools.filter(t => 
            t.status === 'connected' || t.status === 'active'
          ).length;
          
          return (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              whileHover={{ scale: isConnected ? 1 : 1.02 }}
              whileTap={{ scale: isConnected ? 1 : 0.95 }}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                isConnected 
                  ? 'border-green-500 bg-green-50' 
                  : isSelected 
                    ? 'border-blue-500 bg-blue-50 hover:shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md active:scale-95'
              } ${isLoading ? 'cursor-wait opacity-75' : ''}`}
              style={{ 
                backgroundColor: 'var(--background-card)',
                borderColor: isConnected ? 'var(--success-color)' : isSelected ? 'var(--primary-color)' : 'var(--input-border)',
                minHeight: '200px', // Ensure minimum height for better click area
                display: 'flex',
                flexDirection: 'column',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isConnected && !isLoading) {
                  console.log(`🖱️ Tool clicked: ${tool.id}`);
                  handleToolSelect(tool.id);
                }
              }}
              onMouseDown={() => {
                if (!isConnected && !isLoading) {
                  console.log(`🖱️ Mouse down on: ${tool.id}`);
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${tool.color}20` }}
                >
                  {tool.icon}
                </div>
                {isConnected ? (
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Connected</span>
                    {isRecentlyConnected && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                ) : isSelected ? (
                  <div className="flex items-center text-blue-600">
                    <Check className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                ) : null}
              </div>
              
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                {tool.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${tool.color}20`,
                    color: tool.color 
                  }}
                >
                  {tool.category}
                </span>
                
                {isConnected ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      disconnectTool(tool.id);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Disconnect
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectSingleTool(tool.id);
                      }}
                      disabled={isLoading}
                      className="text-sm font-medium px-3 py-1 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: 'var(--primary-color)',
                        color: 'white'
                      }}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Now'}
                    </button>
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToolSelect(tool.id);
                        }}
                        className="text-sm font-medium px-3 py-1 rounded-lg border transition-all"
                        style={{ 
                          borderColor: 'var(--primary-color)',
                          color: 'var(--primary-color)'
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          onClick={() => setShowCustomToolForm(true)}
          className="w-full p-6 rounded-2xl border-2 border-dashed transition-all hover:border-blue-500 hover:bg-blue-50"
          style={{ 
            borderColor: 'var(--input-border)',
            backgroundColor: 'var(--background-card)'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <Plus className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
            <span className="text-lg font-medium" style={{ color: 'var(--primary-color)' }}>
              Add Custom Tool
            </span>
          </div>
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all"
          style={{ 
            backgroundColor: 'var(--background-secondary)',
            color: 'var(--text-secondary)'
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {connectedTools.length} tool{connectedTools.length !== 1 ? 's' : ''} connected
          </div>
          
          <motion.button
            onClick={handleComplete}
            disabled={!canProceed || isLoading}
            className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all"
            whileHover={canProceed && !isLoading ? { scale: 1.05 } : {}}
            whileTap={canProceed && !isLoading ? { scale: 0.95 } : {}}
            style={{ 
              backgroundColor: canProceed && !isLoading ? 'var(--primary-color)' : 'var(--disabled-color)',
              color: 'white',
              cursor: canProceed && !isLoading ? 'pointer' : 'not-allowed'
            }}
          >
            <span>Continue</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Custom Tool Form Modal with Multi-Step Flow */}
      <AnimatePresence>
        {showCustomToolForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCustomToolForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--background-card)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  Add Custom Tool
                </h3>
                <button
                  onClick={() => {
                    setShowCustomToolForm(false);
                    setCurrentStep('select');
                    setCustomToolId(null);
                    setDataMapping([]);
                    setSyncSettings({ frequency: 'manual', isActive: true });
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[
                  { id: 'select', label: 'Basic Info', icon: Settings },
                  { id: 'configure', label: 'Data Mapping', icon: ArrowUpDown },
                  { id: 'sync', label: 'Sync Settings', icon: RefreshCw }
                ].map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = ['configure', 'sync'].includes(currentStep) && index < ['configure', 'sync'].indexOf(currentStep);
                  
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className={`flex-1 h-1 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Basic Info */}
              {currentStep === 'select' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                        Tool Name *
                      </label>
                      <input
                        type="text"
                        value={customToolForm.toolName}
                        onChange={(e) => setCustomToolForm(prev => ({ ...prev, toolName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)'
                        }}
                        placeholder="Enter tool name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                        Category
                      </label>
                      <select
                        value={customToolForm.category}
                        onChange={(e) => setCustomToolForm(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)'
                        }}
                      >
                        {TOOL_CATEGORIES.map((cat: any) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                      Description
                    </label>
                    <textarea
                      value={customToolForm.description}
                      onChange={(e) => setCustomToolForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--input-bg)',
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                      placeholder="Describe your tool (optional)"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                        Base URL *
                      </label>
                      <input
                        type="url"
                        value={customToolForm.baseUrl}
                        onChange={(e) => setCustomToolForm(prev => ({ ...prev, baseUrl: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)'
                        }}
                        placeholder="https://api.yourtool.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                        Test Endpoint
                      </label>
                      <input
                        type="text"
                        value={customToolForm.testEndpoint}
                        onChange={(e) => setCustomToolForm(prev => ({ ...prev, testEndpoint: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)'
                        }}
                        placeholder="/health or /test"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                        Authentication Type
                      </label>
                      <select
                        value={customToolForm.authType}
                        onChange={(e) => setCustomToolForm(prev => ({ ...prev, authType: e.target.value as any }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)'
                        }}
                      >
                        {AUTH_TYPES.map((auth: any) => (
                          <option key={auth.value} value={auth.value}>{auth.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                        API Key / Token
                      </label>
                      <input
                        type="password"
                        value={customToolForm.apiKey}
                        onChange={(e) => setCustomToolForm(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)'
                        }}
                        placeholder="Enter your API key"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setShowCustomToolForm(false);
                        setCurrentStep('select');
                      }}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: 'var(--background-secondary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Cancel
                    </button>
                    <div className="space-x-4">
                      <motion.button
                        onClick={testCustomToolConnection}
                        disabled={isLoading}
                        className="px-6 py-3 rounded-lg font-medium text-white"
                        whileHover={!isLoading ? { scale: 1.05 } : {}}
                        whileTap={!isLoading ? { scale: 0.95 } : {}}
                        style={{ 
                          backgroundColor: 'var(--warning-color)',
                          cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Test Connection'}
                      </motion.button>
                      <motion.button
                        onClick={handleConnectCustomTool}
                        disabled={isLoading}
                        className="px-6 py-3 rounded-lg font-medium text-white"
                        whileHover={!isLoading ? { scale: 1.05 } : {}}
                        whileTap={!isLoading ? { scale: 0.95 } : {}}
                        style={{ 
                          backgroundColor: 'var(--primary-color)',
                          cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Mapping'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Data Mapping */}
              {currentStep === 'configure' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
                      Data Mapping Configuration
                    </h4>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Map your external tool fields to RevOps AI fields for proper data synchronization.
                    </p>
                  </div>

                  {/* Data Mapping Info */}
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--input-border)' }}>
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h5 className="font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                          One-to-One Field Mapping
                        </h5>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Each external field maps to exactly one RevOps AI field. This ensures clean, predictable data transformation.
                          Common external fields are suggested below for your convenience.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add Mapping Form */}
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--input-border)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                          External Field *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={externalFieldInput}
                            onChange={(e) => setExternalFieldInput(e.target.value)}
                            onFocus={() => setShowAddField(true)}
                            onBlur={() => setTimeout(() => setShowAddField(false), 200)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ 
                              backgroundColor: 'var(--input-bg)',
                              borderColor: 'var(--input-border)',
                              color: 'var(--input-text)'
                            }}
                            placeholder="Type or select field..."
                          />
                          {showAddField && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {COMMON_EXTERNAL_FIELDS.filter(field => 
                                field.toLowerCase().includes(externalFieldInput.toLowerCase())
                              ).map((field, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setExternalFieldInput(field);
                                    setShowAddField(false);
                                  }}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                  {field}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                          RevOps AI Field *
                        </label>
                        <select
                          value={selectedRevOpsField}
                          onChange={(e) => setSelectedRevOpsField(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border"
                          style={{ 
                            backgroundColor: 'var(--input-bg)',
                            borderColor: 'var(--input-border)',
                            color: 'var(--input-text)'
                          }}
                        >
                          <option value="">Select field...</option>
                          {REVOPS_FIELDS.map((field: any) => (
                            <option key={field.key} value={field.key}>
                              {field.label} ({field.type})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <motion.button
                          onClick={addMapping}
                          disabled={!externalFieldInput || !selectedRevOpsField}
                          whileHover={{ scale: externalFieldInput && selectedRevOpsField ? 1.05 : 1 }}
                          whileTap={{ scale: externalFieldInput && selectedRevOpsField ? 0.95 : 1 }}
                          className={`w-full px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center space-x-2 ${
                            externalFieldInput && selectedRevOpsField ? '' : 'opacity-50 cursor-not-allowed'
                          }`}
                          style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add Mapping</span>
                        </motion.button>
                      </div>
                      <div className="flex items-end">
                        <motion.button
                          onClick={() => {
                            setExternalFieldInput('');
                            setSelectedRevOpsField('');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 rounded-lg font-medium border-2"
                          style={{ 
                            backgroundColor: 'transparent',
                            borderColor: 'var(--input-border)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          Clear
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Mappings List */}
                  {dataMapping.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-3" style={{ color: 'var(--text-heading)' }}>
                        Current Mappings ({dataMapping.length})
                      </h5>
                      <div className="space-y-2">
                        {dataMapping.map((mapping, index) => {
                          const revOpsField = REVOPS_FIELDS.find((f: any) => f.key === mapping.revOpsField);
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between p-3 rounded-lg border"
                              style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--input-border)' }}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <ArrowUpDown className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-sm font-medium px-2 py-1 rounded" 
                                          style={{ 
                                            backgroundColor: 'var(--background-secondary)', 
                                            color: 'var(--primary-color)' 
                                          }}>
                                      {mapping.externalField}
                                    </span>
                                    <span className="text-gray-400">→</span>
                                    <span className="font-medium" style={{ color: 'var(--text-heading)' }}>
                                      {revOpsField?.label || mapping.revOpsField}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded" 
                                          style={{ 
                                            backgroundColor: 'var(--background-secondary)', 
                                            color: 'var(--text-secondary)' 
                                          }}>
                                      {revOpsField?.type}
                                    </span>
                                  </div>
                                  {revOpsField?.description && (
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                      {revOpsField.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => removeMapping(index)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Mappings State */}
                  {dataMapping.length === 0 && (
                    <div className="text-center py-8">
                      <ArrowUpDown className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        No field mappings configured yet
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        Add mappings above to configure how your external data maps to RevOps AI fields
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <motion.button
                      onClick={() => setCurrentStep('select')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: 'var(--background-secondary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-2" />
                      Back
                    </motion.button>
                    <motion.button
                      onClick={() => setCurrentStep('sync')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg font-medium text-white"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      Continue to Sync Settings
                      <ArrowRight className="w-4 h-4 inline ml-2" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Sync Settings */}
              {currentStep === 'sync' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
                      Synchronization Settings
                    </h4>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Configure how often data should be synced from your custom tool to RevOps AI.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-heading)' }}>
                        Sync Frequency
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SYNC_FREQUENCIES.map((freq: any) => (
                          <motion.div
                            key={freq.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSyncSettings(prev => ({ ...prev, frequency: freq.value }))}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              syncSettings.frequency === freq.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ 
                              backgroundColor: syncSettings.frequency === freq.value ? 'var(--primary-color-light)' : 'var(--background-card)',
                              borderColor: syncSettings.frequency === freq.value ? 'var(--primary-color)' : 'var(--input-border)'
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <RefreshCw className="w-5 h-5" style={{ color: syncSettings.frequency === freq.value ? 'var(--primary-color)' : 'var(--text-secondary)' }} />
                              <div>
                                <div className="font-medium" style={{ color: 'var(--text-heading)' }}>
                                  {freq.label}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {freq.description}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--input-border)' }}>
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-heading)' }}>
                          Enable Automatic Sync
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Automatically sync data based on the frequency settings
                        </div>
                      </div>
                      <button
                        onClick={() => setSyncSettings(prev => ({ ...prev, isActive: !prev.isActive }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          syncSettings.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          syncSettings.isActive ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      onClick={() => setCurrentStep('configure')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: 'var(--background-secondary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-2" />
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handleCompleteCustomToolSetup}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg font-medium text-white"
                      style={{ backgroundColor: 'var(--success-color)' }}
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Complete Setup
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {renderToolSelection()}
      </div>
    </div>
  );
}
