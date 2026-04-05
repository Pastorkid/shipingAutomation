'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface StripeConnectionProps {
  onConnected: () => void;
}

export default function StripeConnection({ onConnected }: StripeConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would open Stripe OAuth
      // For now, we'll simulate the connection process
      toast.loading('Connecting to Stripe...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setIsConnected(true);
      toast.dismiss();
      toast.success('✅ Stripe account connected successfully!');
      
      // Wait a moment before proceeding
      setTimeout(() => {
        onConnected();
      }, 1000);
      
    } catch (error) {
      console.error('Stripe connection error:', error);
      toast.dismiss();
      toast.error('Failed to connect Stripe account. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-2 border-green-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Stripe Connected!</h3>
        <p className="text-gray-600 mb-4">
          Your Stripe account is now connected. We'll automatically detect failed payments and unpaid invoices.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Ready to track payments</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border-2 border-gray-200 p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect Stripe Account</h3>
        <p className="text-gray-600">
          Connect your Stripe account to automatically track failed payments and unpaid invoices
        </p>
      </div>

      <div className="space-y-6">
        {/* What we'll track */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">What RevOps AI will track:</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Failed payments and charges</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Unpaid invoices</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Customer payment history</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">Subscription billing issues</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Real-time Detection</span>
            </div>
            <p className="text-blue-700 text-sm">
              Get instant notifications when payments fail or invoices become overdue
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Automated Reminders</span>
            </div>
            <p className="text-green-700 text-sm">
              We'll automatically send follow-up emails to recover payments
            </p>
          </div>
        </div>

        {/* Connect Button */}
        <div className="text-center">
          <button
            onClick={handleStripeConnect}
            disabled={isConnecting}
            className="text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center space-x-2 mx-auto border-2 border-transparent"
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
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Connect Stripe Account</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Secure OAuth connection • Read-only access • No card data stored
          </p>
        </div>
      </div>
    </motion.div>
  );
}
