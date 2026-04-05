export interface ConnectedTool {
  id: string;
  name: string;
  type: 'stripe' | 'shopify' | 'quickbooks' | 'salesforce' | 'hubspot' | 'googlesheets' | 'custom';
  category: 'payment' | 'ecommerce' | 'accounting' | 'crm' | 'analytics' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  connectedAt?: Date;
  lastSyncAt?: Date;
  config?: ToolConfig;
  dataMapping?: DataMapping[];
  syncSettings?: SyncSettings;
}

export interface ToolConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  authType: 'bearer' | 'basic' | 'oauth' | 'custom_header';
  customHeaders?: Record<string, string>;
  testEndpoint?: string;
}

export interface CustomToolConfig extends ToolConfig {
  toolName: string;
  description?: string;
  category: 'sales' | 'crm' | 'finance' | 'inventory' | 'marketing' | 'analytics' | 'ecommerce';
}

export interface DataMapping {
  id: string;
  externalField: string;
  revOpsField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
}

export interface SyncSettings {
  frequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  isActive: boolean;
}

export interface ConnectedToolsState {
  // State
  isLoading: boolean;
  error: string | null;
  tools: ConnectedTool[];
  selectedTools: string[];
  currentStep: number;
  setupMethod: 'connect' | 'upload' | 'manual';

  // OAuth Flow State
  oauthState: {
    isConnecting: boolean;
    pendingTool: string | null;
    returnUrl: string | null;
    connectionStartTime: number | null;
  };

  // UI State
  uiState: {
    activeView: 'selection' | 'configuration' | 'success';
    recentlyConnected: string[];
    connectionHistory: Array<{
      toolId: string;
      timestamp: number;
      status: 'success' | 'error';
      error?: string;
    }>;
  };

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTools: (tools: ConnectedTool[]) => void;
  addTool: (tool: ConnectedTool) => void;
  updateTool: (id: string, updates: Partial<ConnectedTool>) => void;
  removeTool: (id: string) => void;
  setSelectedTools: (toolIds: string[]) => void;
  toggleToolSelection: (toolId: string) => void;
  setCurrentStep: (step: number) => void;
  setSetupMethod: (method: 'connect' | 'upload' | 'manual') => void;
  connectTool: (toolType: string, config: ToolConfig) => Promise<void>;
  disconnectTool: (toolId: string) => Promise<void>;
  testConnection: (toolId: string) => Promise<boolean>;
  syncTool: (toolId: string) => Promise<void>;
  refreshTools: () => Promise<void>;
  completeToolsSetup: () => void;

  // OAuth Flow Actions
  initiateOAuthConnection: (toolId: string, returnUrl?: string) => void;
  completeOAuthConnection: (toolId: string, success: boolean, error?: string) => void;
  clearOAuthState: () => void;

  // UI Actions
  setActiveView: (view: 'selection' | 'configuration' | 'success') => void;
  addToRecentlyConnected: (toolId: string) => void;
  addConnectionHistory: (entry: { toolId: string; timestamp: number; status: 'success' | 'error'; error?: string }) => void;
}

export const POPULAR_TOOLS = [
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'stripe' as const,
    category: 'payment' as const,
    description: 'Payment processing and subscription management',
    icon: '💳',
    color: '#635BFF'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    type: 'shopify' as const,
    category: 'ecommerce' as const,
    description: 'E-commerce platform and online store',
    icon: '🛒',
    color: '#95BF47'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'quickbooks' as const,
    category: 'accounting' as const,
    description: 'Accounting and financial management',
    icon: '📊',
    color: '#2CA01C'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'salesforce' as const,
    category: 'crm' as const,
    description: 'CRM and sales management',
    icon: '☁️',
    color: '#00A1E0'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'hubspot' as const,
    category: 'crm' as const,
    description: 'Inbound marketing and sales platform',
    icon: '🔶',
    color: '#FF7A59'
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets',
    type: 'googlesheets' as const,
    category: 'analytics' as const,
    description: 'Spreadsheet and data analysis',
    icon: '📈',
    color: '#0F9D58'
  }
];

export const REVOPS_FIELDS = [
  { key: 'revenue', label: 'Revenue', type: 'number' as const, description: 'Total revenue amount' },
  { key: 'customer', label: 'Customer', type: 'string' as const, description: 'Customer name or ID' },
  { key: 'product', label: 'Product', type: 'string' as const, description: 'Product name or SKU' },
  { key: 'order', label: 'Order', type: 'string' as const, description: 'Order ID or reference' },
  { key: 'invoice', label: 'Invoice', type: 'string' as const, description: 'Invoice number' },
  { key: 'expense', label: 'Expense', type: 'number' as const, description: 'Expense amount' },
  { key: 'lead', label: 'Lead', type: 'string' as const, description: 'Lead information' },
  { key: 'conversion', label: 'Conversion', type: 'boolean' as const, description: 'Conversion status' },
  { key: 'subscription', label: 'Subscription', type: 'string' as const, description: 'Subscription details' },
  { key: 'date', label: 'Date', type: 'date' as const, description: 'Transaction date' },
  { key: 'quantity', label: 'Quantity', type: 'number' as const, description: 'Item quantity' },
  { key: 'price', label: 'Price', type: 'number' as const, description: 'Unit price' },
  { key: 'status', label: 'Status', type: 'string' as const, description: 'Order or payment status' },
  { key: 'email', label: 'Email', type: 'string' as const, description: 'Customer email' },
  { key: 'phone', label: 'Phone', type: 'string' as const, description: 'Customer phone' },
  { key: 'address', label: 'Address', type: 'string' as const, description: 'Customer address' },
  { key: 'category', label: 'Category', type: 'string' as const, description: 'Product or service category' },
  { key: 'tags', label: 'Tags', type: 'string' as const, description: 'Descriptive tags' },
  { key: 'notes', label: 'Notes', type: 'string' as const, description: 'Additional notes' },
  { key: 'source', label: 'Source', type: 'string' as const, description: 'Lead or traffic source' }
];

export const COMMON_EXTERNAL_FIELDS = [
  'total-price', 'subtotal', 'tax', 'shipping', 'discount', 'grand_total',
  'email', 'customer_email', 'client_email', 'user_email',
  'first_name', 'last_name', 'full_name', 'customer_name',
  'order_id', 'order_number', 'transaction_id', 'payment_id',
  'created_at', 'updated_at', 'date', 'timestamp',
  'product_name', 'product_title', 'item_name', 'service_name',
  'quantity', 'qty', 'amount', 'count',
  'status', 'order_status', 'payment_status',
  'phone', 'mobile', 'telephone',
  'address', 'shipping_address', 'billing_address',
  'category', 'product_category', 'type'
];

export const TOOL_CATEGORIES = [
  { value: 'sales', label: 'Sales' },
  { value: 'crm', label: 'CRM' },
  { value: 'finance', label: 'Finance' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'ecommerce', label: 'E-commerce' }
];

export const SYNC_FREQUENCIES = [
  { value: 'realtime', label: 'Real-time (Instant sync)', description: 'Sync data immediately when changes occur' },
  { value: 'hourly', label: 'Hourly', description: 'Sync data every hour' },
  { value: 'daily', label: 'Daily', description: 'Sync once per day' },
  { value: 'manual', label: 'Manual', description: 'Sync on demand only' }
];

export const AUTH_TYPES = [
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'oauth', label: 'OAuth 2.0' },
  { value: 'custom_header', label: 'Custom Header' }
];