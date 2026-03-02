'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Loader2, Link2, Shield, Zap, CheckCircle, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface IntegrationCardProps {
  integration: {
    id: string;
    name: string;
    icon: string;
    category: string;
    description: string;
    status?: 'connected' | 'connecting' | 'disconnected';
  };
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export default function IntegrationCard({ integration, onConnect, onDisconnect }: IntegrationCardProps) {
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleConnect = async () => {
    if (integration.status === 'connected') {
      onDisconnect(integration.id);
      return;
    }

    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      onConnect(integration.id);
    }, 2000);
  };

  const getStatusColor = () => {
    switch (integration.status) {
      case 'connected':
        return 'from-emerald-500 to-green-600';
      case 'connecting':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-white drop-shadow-lg" />;
      case 'connecting':
        return <Loader2 className="w-5 h-5 text-white animate-spin drop-shadow-lg" />;
      default:
        return <AlertCircle className="w-5 h-5 text-white drop-shadow-lg" />;
    }
  };

  const cardGradient = integration.status === 'connected' 
    ? 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)'
    : isHovered 
      ? 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 50%, #D1D5DB 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)';

  const buttonGradient = integration.status === 'connected'
    ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)'
    : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        boxShadow: integration.status === 'connected' 
          ? '0 25px 50px -12px rgba(16, 185, 129, 0.25)'
          : '0 25px 50px -12px rgba(59, 130, 246, 0.15)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Glassmorphic Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-500">
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 transition-all duration-700"
          style={{ background: cardGradient }}
        />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${integration.status === 'connected' ? '#10B981' : '#3B82F6'} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${integration.status === 'connected' ? '#059669' : '#2563EB'} 0%, transparent 50%)`,
          }} />
        </div>
        
        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          integration.status === 'connected' ? 'bg-gradient-to-t from-emerald-500/20 to-transparent' : 'bg-gradient-to-t from-blue-500/20 to-transparent'
        }`} />
        
        <div className="relative p-8">
          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute top-6 right-6"
          >
            <div className={`w-12 h-12 rounded-2xl bg-linear-to-r ${getStatusColor()} flex items-center justify-center shadow-xl border-2 border-white/30 backdrop-blur-sm`}>
              {getStatusIcon()}
            </div>
          </motion.div>

          {/* Integration Icon */}
          <div className="flex items-start space-x-6 mb-6">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-5xl drop-shadow-lg filter"
            >
              {integration.icon}
            </motion.div>
            <div className="flex-1">
              <h3 className={`text-2xl font-black mb-2 transition-colors duration-300 ${
                integration.status === 'connected' ? 'text-white' : 'text-gray-900'
              }`}>
                {integration.name}
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  integration.status === 'connected' 
                    ? 'bg-white/20 text-white backdrop-blur-sm border border-white/30' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {integration.category}
                </span>
                {integration.status === 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-1 text-white/90"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold">Connected</span>
                  </motion.div>
                )}
              </div>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                integration.status === 'connected' ? 'text-white/80' : 'text-gray-600'
              }`}>
                {integration.description}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Zap, text: t.realTimeSync, color: 'text-yellow-500' },
              { icon: Shield, text: t.secureConnection, color: 'text-green-500' },
              { icon: Link2, text: t.quickSetup2 || '2-minute setup', color: 'text-blue-500' }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-5 h-5 ${benefit.color} drop-shadow-sm`} />
                  </motion.div>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${
                    integration.status === 'connected' ? 'text-white/90' : 'text-gray-700'
                  }`}>
                    {benefit.text}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Connect Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full py-4 px-8 rounded-2xl font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 backdrop-blur-sm ${
              isConnecting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            style={{ 
              background: buttonGradient,
              boxShadow: integration.status === 'connected' 
                ? '0 10px 25px -5px rgba(239, 68, 68, 0.25)'
                : '0 10px 25px -5px rgba(59, 130, 246, 0.25)'
            }}
          >
            {isConnecting ? (
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.connecting}</span>
              </div>
            ) : integration.status === 'connected' ? (
              <div className="flex items-center justify-center space-x-3">
                <span>{t.disconnect}</span>
                <X className="w-5 h-5" />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <span>{t.connect}</span>
                <Link2 className="w-5 h-5" />
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
