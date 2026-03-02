'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Laptop, Tablet, Monitor, Check, AlertCircle } from 'lucide-react';

// Translation keys interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    deviceVerification: 'Device Verification',
    newDeviceDetected: 'New Device Detected',
    selectDevice: 'Select the device you want to verify:',
    currentDevice: 'Current Device',
    verificationCode: 'Verification Code',
    enterCode: 'Enter the 6-digit code sent to your selected device',
    sendCode: 'Send Code',
    verify: 'Verify',
    verifying: 'Verifying...',
    codeSent: 'Verification code sent!',
    verificationSuccess: 'Device verified successfully!',
    invalidCode: 'Invalid code. Please try again.',
    resendCode: 'Resend Code',
    didntReceiveCode: "Didn't receive the code?",
    cancel: 'Cancel',
    close: 'Close',
  },
  es: {
    deviceVerification: 'Verificación de Dispositivo',
    newDeviceDetected: 'Nuevo Dispositivo Detectado',
    selectDevice: 'Selecciona el dispositivo que quieres verificar:',
    currentDevice: 'Dispositivo Actual',
    verificationCode: 'Código de Verificación',
    enterCode: 'Ingresa el código de 6 dígitos enviado a tu dispositivo seleccionado',
    sendCode: 'Enviar Código',
    verify: 'Verificar',
    verifying: 'Verificando...',
    codeSent: '¡Código de verificación enviado!',
    verificationSuccess: '¡Dispositivo verificado exitosamente!',
    invalidCode: 'Código inválido. Por favor intenta nuevamente.',
    resendCode: 'Reenviar Código',
    didntReceiveCode: '¿No recibiste el código?',
    cancel: 'Cancelar',
    close: 'Cerrar',
  },
  fr: {
    deviceVerification: 'Vérification d\'Appareil',
    newDeviceDetected: 'Nouvel Appareil Détecté',
    selectDevice: 'Sélectionnez l\'appareil que vous souhaitez vérifier:',
    currentDevice: 'Appareil Actuel',
    verificationCode: 'Code de Vérification',
    enterCode: 'Entrez le code à 6 chiffres envoyé à votre appareil sélectionné',
    sendCode: 'Envoyer le Code',
    verify: 'Vérifier',
    verifying: 'Vérification...',
    codeSent: 'Code de vérification envoyé!',
    verificationSuccess: 'Appareil vérifié avec succès!',
    invalidCode: 'Code invalide. Veuillez réessayer.',
    resendCode: 'Renvoyer le Code',
    didntReceiveCode: 'Vous n\'avez pas reçu le code?',
    cancel: 'Annuler',
    close: 'Fermer',
  },
};

interface Device {
  id: string;
  name: string;
  type: 'smartphone' | 'laptop' | 'tablet' | 'monitor';
  isCurrent: boolean;
  lastActive: string;
}

interface DeviceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
}

export default function DeviceVerificationModal({ 
  isOpen, 
  onClose, 
  onVerificationSuccess 
}: DeviceVerificationModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Get language from store (this would be implemented with actual store)
  const language = 'en'; // Default to English for now
  const t = translations[language] || translations.en;

  // Mock devices data
  const devices: Device[] = [
    {
      id: '1',
      name: 'iPhone 13 Pro',
      type: 'smartphone',
      isCurrent: false,
      lastActive: '2 minutes ago'
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'laptop',
      isCurrent: true,
      lastActive: 'Currently active'
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      isCurrent: false,
      lastActive: '1 hour ago'
    },
    {
      id: '4',
      name: 'Desktop PC',
      type: 'monitor',
      isCurrent: false,
      lastActive: '3 days ago'
    }
  ];

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'monitor':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  const handleSendCode = async () => {
    if (!selectedDevice) return;
    
    setIsSendingCode(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSendingCode(false);
      setCodeSent(true);
    }, 1500);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError(t.invalidCode);
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    // Simulate verification API call
    setTimeout(() => {
      setIsVerifying(false);
      if (verificationCode === '123456') { // Mock success code
        setVerificationStatus('success');
        setTimeout(() => {
          onVerificationSuccess();
          handleClose();
        }, 2000);
      } else {
        setVerificationStatus('error');
        setError(t.invalidCode);
      }
    }, 1500);
  };

  const handleClose = () => {
    // Reset state
    setSelectedDevice('');
    setVerificationCode('');
    setCodeSent(false);
    setVerificationStatus('idle');
    setError('');
    onClose();
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and max 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    if (error) setError('');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />
          
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--background-card)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--input-border)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-heading)' }}>
                {t.deviceVerification}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <div className="p-6">
              {verificationStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                    {t.verificationSuccess}
                  </h3>
                </motion.div>
              ) : (
                <>
                  {/* Alert Message */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 p-4 rounded-lg mb-6"
                    style={{ backgroundColor: 'var(--alert-info-bg)' }}
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--alert-info-text)' }} />
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--alert-info-text)' }}>
                        {t.newDeviceDetected}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: 'var(--alert-info-text)' }}>
                        {t.selectDevice}
                      </p>
                    </div>
                  </motion.div>

                  {/* Device Selection */}
                  {!codeSent && (
                    <div className="space-y-3 mb-6">
                      {devices.map((device, index) => (
                        <motion.div
                          key={device.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setSelectedDevice(device.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedDevice === device.id
                              ? 'border-primary bg-primary bg-opacity-5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{
                            borderColor: selectedDevice === device.id ? 'var(--primary)' : 'var(--input-border)',
                            backgroundColor: selectedDevice === device.id ? 'var(--alert-info-bg)' : 'transparent'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div style={{ color: 'var(--text-secondary)' }}>
                                {getDeviceIcon(device.type)}
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: 'var(--text-heading)' }}>
                                  {device.name}
                                  {device.isCurrent && (
                                    <span className="ml-2 text-xs px-2 py-1 rounded-full" 
                                          style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                                      {t.currentDevice}
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {device.lastActive}
                                </p>
                              </div>
                            </div>
                            {selectedDevice === device.id && (
                              <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Verification Code Input */}
                  {codeSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                          {t.verificationCode}
                        </label>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                          {t.enterCode}
                        </p>
                        <div className="flex justify-center space-x-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength={1}
                              value={verificationCode[index] || ''}
                              onChange={(e) => {
                                const newValue = verificationCode.split('');
                                newValue[index] = e.target.value;
                                handleCodeChange(newValue.join(''));
                                
                                // Auto-focus next input
                                if (e.target.value && index < 5) {
                                  const nextInput = document.getElementById(`code-${index + 1}`);
                                  if (nextInput) (nextInput as HTMLInputElement).focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                // Handle backspace
                                if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                                  const prevInput = document.getElementById(`code-${index - 1}`);
                                  if (prevInput) (prevInput as HTMLInputElement).focus();
                                }
                              }}
                              id={`code-${index}`}
                              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                                error ? 'border-red-300' : 'border-gray-300'
                              }`}
                              style={{ 
                                backgroundColor: 'var(--input-bg)', 
                                color: 'var(--input-text)',
                                borderColor: error ? 'var(--accent-orange)' : 'var(--input-border)'
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600 text-center"
                        >
                          {error}
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-6">
                    {!codeSent ? (
                      <>
                        <button
                          onClick={handleClose}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--input-border)', color: 'var(--text-heading)' }}
                        >
                          {t.cancel}
                        </button>
                        <motion.button
                          onClick={handleSendCode}
                          disabled={!selectedDevice || isSendingCode}
                          className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary)' }}
                          whileHover={{ scale: !selectedDevice || isSendingCode ? 1 : 1.02 }}
                          whileTap={{ scale: !selectedDevice || isSendingCode ? 1 : 0.98 }}
                        >
                          {isSendingCode ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            t.sendCode
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setCodeSent(false);
                            setVerificationCode('');
                          }}
                          className="px-4 py-3 text-sm font-medium hover:underline transition-colors"
                          style={{ color: 'var(--text-link)' }}
                        >
                          {t.resendCode}
                        </button>
                        <motion.button
                          onClick={handleVerify}
                          disabled={verificationCode.length !== 6 || isVerifying}
                          className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary)' }}
                          whileHover={{ scale: verificationCode.length !== 6 || isVerifying ? 1 : 1.02 }}
                          whileTap={{ scale: verificationCode.length !== 6 || isVerifying ? 1 : 0.98 }}
                        >
                          {isVerifying ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            t.verify
                          )}
                        </motion.button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
