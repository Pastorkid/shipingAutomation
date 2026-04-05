'use client';

import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, TrendingUp, Mail, ArrowRight, CreditCard, FileSpreadsheet, Upload } from 'lucide-react';

interface V1SetupCompleteProps {
  selectedMethod: 'stripe' | 'google-sheets' | 'manual' | null;
  onComplete: () => void;
}

export default function V1SetupComplete({ selectedMethod, onComplete }: V1SetupCompleteProps) {
  const getMethodInfo = () => {
    switch (selectedMethod) {
      case 'stripe':
        return {
          icon: CreditCard,
          title: 'Stripe Account Connected',
          description: 'Automatic payment tracking enabled',
          color: 'blue'
        };
      case 'google-sheets':
        return {
          icon: FileSpreadsheet,
          title: 'Google Sheets Connected',
          description: 'Invoice data monitoring active',
          color: 'green'
        };
      case 'manual':
        return {
          icon: Upload,
          title: 'Data Uploaded Successfully',
          description: 'Your invoice files have been processed',
          color: 'purple'
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Setup Complete',
          description: 'Ready to track payments',
          color: 'gray'
        };
    }
  };

  const methodInfo = getMethodInfo();
  const MethodIcon = methodInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Success Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Setup Complete!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your payment tracking system is now ready. RevOps AI will automatically detect unpaid invoices and send follow-up reminders.
        </p>
      </div>

      {/* Method Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`bg-white rounded-xl border-2 border-${methodInfo.color}-200 p-6 mb-8`}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-${methodInfo.color}-100 rounded-full flex items-center justify-center`}>
            <MethodIcon className={`w-6 h-6 text-${methodInfo.color}-600`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{methodInfo.title}</h3>
            <p className="text-gray-600">{methodInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* What Happens Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What happens next?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Payment Detection</h3>
            <p className="text-sm text-gray-600">
              We'll automatically detect unpaid invoices and failed payments from your connected source
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Reminders</h3>
            <p className="text-sm text-gray-600">
              Automated follow-up emails sent at optimal times to maximize payment recovery
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Recovery Tracking</h3>
            <p className="text-sm text-gray-600">
              Track recovered payments and see your revenue recovery in real-time
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-8 mb-8 text-white"
        style={{ backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Your Dashboard Preview
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-blue-100">Unpaid Invoices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">$0</div>
            <div className="text-blue-100">Recovered This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">$0</div>
            <div className="text-blue-100">Outstanding Revenue</div>
          </div>
        </div>
        
        <p className="text-center text-blue-100 mt-6">
          Start tracking payments to see your recovery metrics here
        </p>
      </motion.div>

      {/* Tips for Success */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
      >
        <h3 className="font-semibold text-yellow-900 mb-3">💡 Tips for Success</h3>
        <ul className="space-y-2 text-yellow-800 text-sm">
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Keep your payment source updated (Stripe account, Google Sheets, or upload new files regularly)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Monitor your dashboard for new unpaid invoices and recovery progress</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Customize email templates in settings to match your brand voice</span>
          </li>
        </ul>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <button
          onClick={onComplete}
          className="text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center space-x-2 mx-auto border-2 border-transparent"
          style={{ backgroundColor: 'var(--primary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-gray-500 mt-3">
          Start tracking your unpaid payments and recovering revenue
        </p>
      </motion.div>
    </motion.div>
  );
}
