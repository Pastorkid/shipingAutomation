'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building, DollarSign, Package, Users, CreditCard, Target, Zap, Plus, X, CheckCircle, Upload, FileText } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import DataUploadDropzone from './DataUploadDropzone';

interface ManualSetupData {
  businessType: string;
  revenueModel: string;
  productsServices: Array<{
    id: string;
    name: string;
    price: number;
    cost?: number;
    category: string;
    type: 'product' | 'service';
    description?: string;
  }>;
  customersStructure: {
    managementType: string;
    customers: Array<{
      id: string;
      name: string;
      email: string;
      value?: number;
    }>;
  };
  operationalCosts: Array<{
    id: string;
    name: string;
    amount: number;
    frequency: 'monthly' | 'yearly';
  }>;
  automationPreferences: string[];
  primaryGoal: string;
}

interface ManualSetupFlowProps {
  onComplete: (data: ManualSetupData) => void;
  onBack: () => void;
}

const businessTypes = [
  { id: 'ecommerce', name: 'E-commerce', icon: Package },
  { id: 'saas', name: 'SaaS', icon: Zap },
  { id: 'service', name: 'Service-based', icon: Users },
  { id: 'consulting', name: 'Consulting', icon: Target },
  { id: 'agency', name: 'Agency', icon: Building },
  { id: 'retail', name: 'Retail / POS', icon: CreditCard },
  { id: 'subscription', name: 'Subscription business', icon: DollarSign },
  { id: 'marketplace', name: 'Marketplace', icon: Package },
  { id: 'custom', name: 'Custom', icon: Building },
];

const revenueModels = [
  { id: 'onetime', name: 'One-time sales', description: 'Sell products or services once' },
  { id: 'subscription', name: 'Recurring subscriptions', description: 'Monthly/annual recurring revenue' },
  { id: 'invoices', name: 'Invoices', description: 'Bill clients for services rendered' },
  { id: 'retainers', name: 'Retainers', description: 'Upfront payments for ongoing services' },
  { id: 'commission', name: 'Commission-based', description: 'Earn percentage from sales' },
  { id: 'mixed', name: 'Mixed model', description: 'Multiple revenue streams' },
];

const automationOptions = [
  { id: 'leadFollowUps', name: 'Lead follow-ups', icon: Users },
  { id: 'invoiceReminders', name: 'Invoice reminders', icon: CreditCard },
  { id: 'abandonedCart', name: 'Abandoned cart recovery', icon: Package },
  { id: 'customerReEngagement', name: 'Customer re-engagement', icon: Target },
  { id: 'upsellCampaigns', name: 'Upsell campaigns', icon: DollarSign },
  { id: 'expenseMonitoring', name: 'Expense monitoring', icon: CreditCard },
];

const primaryGoals = [
  { id: 'revenue', name: 'Revenue growth', description: 'Focus on increasing sales' },
  { id: 'cashflow', name: 'Cash flow stability', description: 'Maintain healthy cash flow' },
  { id: 'costs', name: 'Cost reduction', description: 'Optimize and reduce expenses' },
  { id: 'customers', name: 'Customer growth', description: 'Acquire and retain customers' },
  { id: 'sales', name: 'Sales performance', description: 'Improve sales efficiency' },
];

export default function ManualSetupFlow({ onComplete, onBack }: ManualSetupFlowProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ManualSetupData>({
    businessType: '',
    revenueModel: '',
    productsServices: [],
    customersStructure: {
      managementType: '',
      customers: []
    },
    operationalCosts: [],
    automationPreferences: [],
    primaryGoal: '',
  });

  const steps = [
    { id: 1, title: t.businessType, icon: Building },
    { id: 2, title: t.revenueModel, icon: DollarSign },
    { id: 3, title: t.productsServices, icon: Package },
    { id: 4, title: t.customersStructure, icon: Users },
    { id: 5, title: t.operationalCosts, icon: CreditCard },
    { id: 6, title: t.automationPreferences, icon: Zap },
    { id: 7, title: t.dashboardPersonalization, icon: Target },
  ];

  const updateData = (updates: Partial<ManualSetupData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const addProductService = (type: 'product' | 'service') => {
    // Validate existing products/services before adding new one
    const incompleteItem = data.productsServices.find(item => 
      !item.name.trim() || !item.price || item.price <= 0
    );
    
    if (incompleteItem) {
      // Find the incomplete item and focus it
      const incompleteElement = document.getElementById(`product-${incompleteItem.id}`);
      if (incompleteElement) {
        incompleteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = incompleteElement.querySelector('input');
        if (firstInput) {
          firstInput.focus();
          // Add visual feedback
          firstInput.classList.add('ring-2', 'ring-red-500');
          setTimeout(() => {
            firstInput.classList.remove('ring-2', 'ring-red-500');
          }, 2000);
        }
      }
      return;
    }
    
    const newItem = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      cost: 0,
      category: '',
      type,
      description: ''
    };
    updateData({
      productsServices: [...data.productsServices, newItem]
    });
    
    // Auto-scroll to the new product/service input
    setTimeout(() => {
      const newElement = document.getElementById(`product-${newItem.id}`);
      if (newElement) {
        newElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = newElement.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const removeProductService = (id: string) => {
    updateData({
      productsServices: data.productsServices.filter(item => item.id !== id)
    });
  };

  const updateProductService = (id: string, updates: Partial<typeof data.productsServices[0]>) => {
    updateData({
      productsServices: data.productsServices.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  const addCustomer = () => {
    // Validate existing customers before adding new one
    const incompleteCustomer = data.customersStructure.customers.find(customer => 
      !customer.name.trim() || !customer.email.trim()
    );
    
    if (incompleteCustomer) {
      // Find the incomplete customer and focus it
      const incompleteElement = document.getElementById(`customer-${incompleteCustomer.id}`);
      if (incompleteElement) {
        incompleteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = incompleteElement.querySelector('input');
        if (firstInput) {
          firstInput.focus();
          // Add visual feedback
          firstInput.classList.add('ring-2', 'ring-red-500');
          setTimeout(() => {
            firstInput.classList.remove('ring-2', 'ring-red-500');
          }, 2000);
        }
      }
      return;
    }
    
    const newCustomer = {
      id: Date.now().toString(),
      name: '',
      email: '',
      value: 0
    };
    updateData({
      customersStructure: {
        ...data.customersStructure,
        customers: [...data.customersStructure.customers, newCustomer]
      }
    });
    
    // Auto-scroll to the new customer input
    setTimeout(() => {
      const newCustomerElement = document.getElementById(`customer-${newCustomer.id}`);
      if (newCustomerElement) {
        newCustomerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = newCustomerElement.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const removeCustomer = (id: string) => {
    updateData({
      customersStructure: {
        ...data.customersStructure,
        customers: data.customersStructure.customers.filter(c => c.id !== id)
      }
    });
  };

  const updateCustomer = (id: string, updates: Partial<typeof data.customersStructure.customers[0]>) => {
    updateData({
      customersStructure: {
        ...data.customersStructure,
        customers: data.customersStructure.customers.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      }
    });
  };

  const addExpense = () => {
    // Validate existing expenses before adding new one
    const incompleteExpense = data.operationalCosts.find(expense => 
      !expense.name.trim() || !expense.amount || expense.amount <= 0
    );
    
    if (incompleteExpense) {
      // Find the incomplete expense and focus it
      const incompleteElement = document.getElementById(`expense-${incompleteExpense.id}`);
      if (incompleteElement) {
        incompleteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = incompleteElement.querySelector('input');
        if (firstInput) {
          firstInput.focus();
          // Add visual feedback
          firstInput.classList.add('ring-2', 'ring-red-500');
          setTimeout(() => {
            firstInput.classList.remove('ring-2', 'ring-red-500');
          }, 2000);
        }
      }
      return;
    }
    
    const newExpense = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      frequency: 'monthly' as const
    };
    updateData({
      operationalCosts: [...data.operationalCosts, newExpense]
    });
    
    // Auto-scroll to the new expense input
    setTimeout(() => {
      const newExpenseElement = document.getElementById(`expense-${newExpense.id}`);
      if (newExpenseElement) {
        newExpenseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = newExpenseElement.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const removeExpense = (id: string) => {
    updateData({
      operationalCosts: data.operationalCosts.filter(expense => expense.id !== id)
    });
  };

  const updateExpense = (id: string, updates: Partial<typeof data.operationalCosts[0]>) => {
    updateData({
      operationalCosts: data.operationalCosts.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      )
    });
  };

  const toggleAutomation = (automationId: string) => {
    updateData({
      automationPreferences: data.automationPreferences.includes(automationId)
        ? data.automationPreferences.filter(id => id !== automationId)
        : [...data.automationPreferences, automationId]
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Business Type
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.whatTypeOfBusiness}</h2>
              <p className="text-gray-600">This helps AI tailor automation rules for your business</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ businessType: type.id })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      data.businessType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 1: // Revenue Model
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.howDoYouMakeMoney}</h2>
              <p className="text-gray-600">This determines automation logic and forecasting</p>
            </div>
            
            <div className="space-y-3">
              {revenueModels.map((model) => (
                <motion.button
                  key={model.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => updateData({ revenueModel: model.id })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    data.revenueModel === model.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Products/Services
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.productsServices}</h2>
              <p className="text-gray-600">Add your products or services to enable tracking</p>
            </div>
            
            {/* Sticky Add Buttons */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-2 border-b border-gray-200 z-10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {data.productsServices.length} {data.productsServices.length === 1 ? 'item' : 'items'} added
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => addProductService('product')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addProduct}
                  </button>
                  <button
                    onClick={() => addProductService('service')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addService}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Products/Services List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.productsServices.map((item, index) => (
                <motion.div
                  key={item.id}
                  id={`product-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded capitalize">
                      {item.type} {index + 1}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({item.type === 'product' ? 'Product' : 'Service'})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                    <div className="relative lg:col-span-1">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {item.type === 'product' ? t.productName : t.serviceName}
                      </label>
                      <input
                        type="text"
                        placeholder={item.type === 'product' ? t.productName : t.serviceName}
                        value={item.name}
                        onChange={(e) => updateProductService(item.id, { name: e.target.value })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {t.price}
                      </label>
                      <input
                        type="number"
                        placeholder={t.price}
                        value={item.price || ''}
                        onChange={(e) => updateProductService(item.id, { price: parseFloat(e.target.value) || 0 })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {t.cost}
                      </label>
                      <input
                        type="number"
                        placeholder={t.cost}
                        value={item.cost || ''}
                        onChange={(e) => updateProductService(item.id, { cost: parseFloat(e.target.value) || 0 })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 mt-2">
                    <div className="relative">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {t.category}
                      </label>
                      <input
                        type="text"
                        placeholder={t.category}
                        value={item.category}
                        onChange={(e) => updateProductService(item.id, { category: e.target.value })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => removeProductService(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center justify-center p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="relative mt-2">
                    <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                      {t.description}
                    </label>
                    <textarea
                      placeholder={t.description}
                      value={item.description || ''}
                      onChange={(e) => updateProductService(item.id, { description: e.target.value })}
                      className="w-full px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-400 resize-none"
                      rows={2}
                    />
                  </div>
                </motion.div>
              ))}
              
              {/* Empty state */}
              {data.productsServices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No products or services added yet</p>
                  <p className="text-sm">Click "Add Product" or "Add Service" to get started</p>
                </div>
              )}
            </div>
            
            {/* Quick Add Buttons at bottom */}
            <div className="flex justify-center gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => addProductService('product')}
                className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add product
              </button>
              <button
                onClick={() => addProductService('service')}
                className="px-3 py-1 text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add service
              </button>
            </div>
          </motion.div>
        );

      case 3: // Customers Structure
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.howDoYouManageCustomers}</h2>
              <p className="text-gray-600">Tell us how you handle customer relationships</p>
            </div>
            
            <div className="space-y-3">
              {['manual', 'crm', 'csv', 'starting'].map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => updateData({ 
                    customersStructure: { ...data.customersStructure, managementType: type }
                  })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    data.customersStructure.managementType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">
                    {type === 'manual' && t.manualEntry}
                    {type === 'crm' && t.crmImport}
                    {type === 'csv' && t.uploadCsv}
                    {type === 'starting' && t.justStarting}
                  </h3>
                </motion.button>
              ))}
            </div>
            
            {data.customersStructure.managementType === 'manual' && (
              <div className="space-y-4">
                {/* Sticky Add Customer Button */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-2 border-b border-gray-200 z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {data.customersStructure.customers.length} {data.customersStructure.customers.length === 1 ? 'customer' : 'customers'} added
                    </span>
                    <button
                      onClick={addCustomer}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t.addCustomer}
                    </button>
                  </div>
                </div>
                
                {/* Customer List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.customersStructure.customers.map((customer, index) => (
                    <motion.div
                      key={customer.id}
                      id={`customer-${customer.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          Customer {index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                        <div className="relative">
                          <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                            {t.customerName}
                          </label>
                          <input
                            type="text"
                            placeholder={t.customerName}
                            value={customer.name}
                            onChange={(e) => updateCustomer(customer.id, { name: e.target.value })}
                            className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                            {t.customerEmail}
                          </label>
                          <input
                            type="email"
                            placeholder={t.customerEmail}
                            value={customer.email}
                            onChange={(e) => updateCustomer(customer.id, { email: e.target.value })}
                            className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                            {t.customerValue}
                          </label>
                          <input
                            type="number"
                            placeholder={t.customerValue}
                            value={customer.value || ''}
                            onChange={(e) => updateCustomer(customer.id, { value: parseFloat(e.target.value) || 0 })}
                            className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                          />
                        </div>
                        <button
                          onClick={() => removeCustomer(customer.id)}
                          className="mt-6 text-red-500 hover:text-red-700 flex items-center justify-center p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Empty state */}
                  {data.customersStructure.customers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No customers added yet</p>
                      <p className="text-sm">Click "Add Customer" to get started</p>
                    </div>
                  )}
                </div>
                
                {/* Quick Add Button at bottom */}
                <div className="flex justify-center pt-2 border-t border-gray-200">
                  <button
                    onClick={addCustomer}
                    className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add another customer
                  </button>
                </div>
              </div>
            )}
            
            {data.customersStructure.managementType === 'crm' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CRM Integration</h3>
                  <p className="text-gray-600 mb-4">Connect your CRM to automatically import customers</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM'].map((crm) => (
                      <motion.button
                        key={crm}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{crm}</h4>
                            <p className="text-sm text-gray-600">Connect your {crm} account</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {data.customersStructure.managementType === 'csv' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Customer Data</h3>
                  <p className="text-gray-600 mb-4">Upload a CSV or Excel file with your customer information</p>
                </div>
                
                <DataUploadDropzone 
                  onUpload={(files) => {
                    console.log('Customer files uploaded:', files);
                    // TODO: Process customer files and extract data
                  }}
                  acceptedTypes={['.csv', '.xlsx', '.xls']}
                />
                
                <div className="text-center text-sm text-gray-500">
                  <p>Expected columns: Name, Email, Phone, Value</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            )}
            
            {data.customersStructure.managementType === 'starting' && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Just Starting?</h3>
                <p className="text-gray-600 mb-4">No problem! You can add customers later as you grow.</p>
                <p className="text-sm text-gray-500">We'll help you set up customer management when you're ready.</p>
              </div>
            )}
          </motion.div>
        );

      case 4: // Operational Costs
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.whatAreYourRecurringExpenses}</h2>
              <p className="text-gray-600">This enables cost leak detection and profit calculation</p>
            </div>
            
            {/* Sticky Add Expense Button */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-2 border-b border-gray-200 z-10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {data.operationalCosts.length} {data.operationalCosts.length === 1 ? 'expense' : 'expenses'} added
                </span>
                <button
                  onClick={addExpense}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t.addExpense}
                </button>
              </div>
            </div>
            
            {/* Expenses List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.operationalCosts.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  id={`expense-${expense.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      Expense {index + 1}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({expense.frequency === 'monthly' ? 'Monthly' : 'Yearly'})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                    <div className="relative lg:col-span-1">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {t.expenseName}
                      </label>
                      <input
                        type="text"
                        placeholder={t.expenseName}
                        value={expense.name}
                        onChange={(e) => updateExpense(expense.id, { name: e.target.value })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {t.expenseAmount}
                      </label>
                      <input
                        type="number"
                        placeholder={t.expenseAmount}
                        value={expense.amount || ''}
                        onChange={(e) => updateExpense(expense.id, { amount: parseFloat(e.target.value) || 0 })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base placeholder-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-2 text-xs bg-white px-1 text-gray-600">
                        {t.expenseFrequency}
                      </label>
                      <select
                        value={expense.frequency}
                        onChange={(e) => updateExpense(expense.id, { frequency: e.target.value as 'monthly' | 'yearly' })}
                        className="px-3 py-3 pt-5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base appearance-none bg-white"
                      >
                        <option value="monthly">{t.monthly}</option>
                        <option value="yearly">{t.yearly}</option>
                      </select>
                    </div>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 flex items-center justify-center p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {/* Empty state */}
              {data.operationalCosts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No expenses added yet</p>
                  <p className="text-sm">Click "Add Expense" to track your recurring costs</p>
                </div>
              )}
            </div>
            
            {/* Quick Add Button at bottom */}
            <div className="flex justify-center pt-2 border-t border-gray-200">
              <button
                onClick={addExpense}
                className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add another expense
              </button>
            </div>
          </motion.div>
        );

      case 5: // Automation Preferences
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.whatShouldRevOpsAutomate}</h2>
              <p className="text-gray-600">Choose what to automate first</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = data.automationPreferences.includes(option.id);
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleAutomation(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-gray-900 text-left">{option.name}</span>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 6: // Dashboard Personalization
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.whatMattersMost}</h2>
              <p className="text-gray-600">This changes your dashboard priority</p>
            </div>
            
            <div className="space-y-3">
              {primaryGoals.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => updateData({ primaryGoal: goal.id })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    data.primaryGoal === goal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return data.businessType !== '';
      case 1: return data.revenueModel !== '';
      case 2: return data.productsServices.length > 0;
      case 3: return data.customersStructure.managementType !== '';
      case 4: return true; // Optional step
      case 5: return data.automationPreferences.length > 0;
      case 6: return data.primaryGoal !== '';
      default: return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
          <p className="text-sm text-gray-600">
            {t.step} {currentStep + 1} {t.of} {steps.length}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <div key={currentStep}>
          {renderStep()}
        </div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 0 ? t.back : t.previous}
        </button>
        
        <button
          onClick={nextStep}
          disabled={!isStepValid()}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            isStepValid()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === steps.length - 1 ? t.completeSetup : t.next}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
