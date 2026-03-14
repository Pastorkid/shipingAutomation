'use client';

import { motion } from 'framer-motion';
import { Link, Upload, Settings, Zap, TrendingUp, Database, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface SetupMethodSelectorProps {
  onSelectMethod: (method: 'connect' | 'upload' | 'manual') => void;
}

export default function SetupMethodSelector({ onSelectMethod }: SetupMethodSelectorProps) {
  const { t } = useTranslation();

  const methods = [
    {
      id: 'connect',
      icon: Link,
      title: t.connectExistingTools,
      description: t.connectExistingToolsDesc,
      features: [t.realTimeSync, t.noManualWork, t.instantSetup],
      color: 'from-blue-600 via-blue-500 to-indigo-600',
      popular: true,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
      glowColor: 'shadow-blue-500/25'
    },
    {
      id: 'upload',
      icon: Upload,
      title: t.uploadBusinessData,
      description: t.uploadBusinessDataDesc,
      features: [t.aiAnalysis, t.smartDetection, t.quickSetup2],
      color: 'from-emerald-600 via-green-500 to-teal-600',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #14B8A6 100%)',
      glowColor: 'shadow-emerald-500/25'
    },
    {
      id: 'manual',
      icon: Settings,
      title: t.manualSetup,
      description: t.manualSetupDesc,
      features: [t.fullControl, t.customConfiguration, t.detailedSetup],
      color: 'from-purple-600 via-pink-500 to-rose-600',
      gradient: 'linear-gradient(135deg, #9333EA 0%, #EC4899 50%, #F43F5E 100%)',
      glowColor: 'shadow-purple-500/25'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 mx-auto mb-6 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <Zap className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          {t.chooseSetupPath}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t.setupPathDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {methods.map((method, index) => {
          const Icon = method.icon;
          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: `0 25px 50px -12px ${method.glowColor}`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMethod(method.id as 'connect' | 'upload' | 'manual')}
              className={`relative group cursor-pointer transition-all duration-500 ${
                method.popular 
                  ? 'scale-105' 
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {method.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border border-white/20 backdrop-blur-sm">
                    ⭐ {t.mostPopular}
                  </div>
                </motion.div>
              )}

              {/* Glassmorphic Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{ background: method.gradient }}
                />
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-r ${method.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500`}
                  >
                    <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </motion.div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                      {method.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {method.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {method.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.15 + idx * 0.1 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Zap className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
                          </motion.div>
                          <span className="text-sm font-semibold text-gray-700">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 px-8 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 backdrop-blur-sm`}
                      style={{ 
                        background: method.gradient,
                        boxShadow: `0 10px 25px -5px ${method.glowColor}`
                      }}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{t.getStarted}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
