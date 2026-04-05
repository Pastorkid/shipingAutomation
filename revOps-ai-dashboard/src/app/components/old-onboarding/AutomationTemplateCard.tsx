'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, CheckCircle, Clock, Zap, DollarSign, Users, Mail, BarChart3, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  estimatedTime: string;
  potentialSavings: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  isActive: boolean;
}

interface AutomationTemplateCardProps {
  template: AutomationTemplate;
  onToggle: (templateId: string) => void;
}

export default function AutomationTemplateCard({ template, onToggle }: AutomationTemplateCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'from-green-500 to-emerald-600';
      case 'leads': return 'from-blue-500 to-indigo-600';
      case 'marketing': return 'from-purple-500 to-pink-600';
      case 'analytics': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const Icon = template.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
        template.isActive 
          ? 'border-green-500 bg-linear-to-br from-green-50 to-emerald-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Status Badge */}
      {template.isActive && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>{t.active}</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${getCategoryColor(template.category)} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-7 h-7 text-white shrink-0" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
            {template.difficulty.toUpperCase()}
          </span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {template.category}
          </span>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{template.estimatedTime}</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{t.potentialSavings}</span>
          </div>
          <span className="text-sm font-bold text-green-600">{template.potentialSavings}</span>
        </div>

        {/* Expandable Steps */}
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>{isExpanded ? t.hideAutomationSteps : t.showAutomationSteps}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {template.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggle(template.id)}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 ${
            template.isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
          }`}
        >
          {template.isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>{t.stopAutomation}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{t.startAutomation}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Predefined templates data
export const automationTemplates: AutomationTemplate[] = [
  {
    id: 'recover-unpaid-invoices',
    name: 'Recover Unpaid Invoices',
    description: 'Automatically follow up on overdue invoices with escalating reminders and payment options.',
    icon: DollarSign,
    category: 'revenue',
    estimatedTime: '2 min setup',
    potentialSavings: '$2,500/month',
    difficulty: 'easy',
    steps: [
      'Monitor invoice due dates',
      'Send friendly reminder at 7 days overdue',
      'Send formal reminder at 14 days overdue',
      'Offer payment plan at 21 days overdue',
      'Escalate to management at 30 days overdue'
    ],
    isActive: false
  },
  {
    id: 'follow-up-leads',
    name: 'Lead Follow-Up System',
    description: 'Nurture cold leads automatically with personalized email sequences and timely follow-ups.',
    icon: Users,
    category: 'leads',
    estimatedTime: '5 min setup',
    potentialSavings: '15 hours/week',
    difficulty: 'medium',
    steps: [
      'New lead enters system',
      'Send welcome email within 1 hour',
      'Send follow-up email after 3 days',
      'Send case study after 7 days',
      'Send personalized offer after 14 days',
      'Add to long-term nurture if no response'
    ],
    isActive: false
  },
  {
    id: 'revenue-reporting',
    name: 'Monthly Revenue Reports',
    description: 'Generate and send comprehensive revenue reports automatically to stakeholders.',
    icon: BarChart3,
    category: 'analytics',
    estimatedTime: '3 min setup',
    potentialSavings: '8 hours/month',
    difficulty: 'easy',
    steps: [
      'Collect revenue data from all sources',
      'Generate visual charts and insights',
      'Create executive summary',
      'Send report on 1st of each month',
      'Follow up with key stakeholders'
    ],
    isActive: false
  },
  {
    id: 'customer-retention',
    name: 'Customer Retention Campaign',
    description: 'Identify at-risk customers and automatically launch retention campaigns.',
    icon: Mail,
    category: 'marketing',
    estimatedTime: '10 min setup',
    potentialSavings: '25% churn reduction',
    difficulty: 'hard',
    steps: [
      'Monitor customer activity levels',
      'Identify declining engagement patterns',
      'Trigger personalized re-engagement emails',
      'Offer special discounts or incentives',
      'Schedule follow-up calls for high-value customers'
    ],
    isActive: false
  }
];

export { AutomationTemplateCard };
