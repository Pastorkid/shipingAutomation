'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// Translation keys interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    fullName: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    companyName: 'Company Name',
    forgotPassword: 'Forgot password?',
    login: 'Sign In',
    signup: 'Create Account',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInHere: 'Sign in here',
    signUpHere: 'Sign up here',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsNotMatch: 'Passwords do not match',
    validEmail: 'Please enter a valid email address',
    required: 'This field is required',
  },
  es: {
    fullName: 'Nombre Completo',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    companyName: 'Nombre de la Empresa',
    forgotPassword: '¿Olvidaste tu contraseña?',
    login: 'Iniciar Sesión',
    signup: 'Crear Cuenta',
    createAccount: 'Crear Cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    signInHere: 'Inicia sesión aquí',
    signUpHere: 'Regístrate aquí',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordsNotMatch: 'Las contraseñas no coinciden',
    validEmail: 'Por favor ingresa un correo válido',
    required: 'Este campo es requerido',
  },
  fr: {
    fullName: 'Nom Complet',
    email: 'Adresse Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    companyName: 'Nom de l\'entreprise',
    forgotPassword: 'Mot de passe oublié?',
    login: 'Se Connecter',
    signup: 'Créer un Compte',
    createAccount: 'Créer un Compte',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: 'Vous n\'avez pas de compte?',
    signInHere: 'Connectez-vous ici',
    signUpHere: 'Inscrivez-vous ici',
    passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordsNotMatch: 'Les mots de passe ne correspondent pas',
    validEmail: 'Veuillez entrer une adresse email valide',
    required: 'Ce champ est obligatoire',
  },
};

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function AuthForm({ type, onSubmit, loading = false }: AuthFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use global translations
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (type === 'signup' && !formData.fullName.trim()) {
      newErrors.fullName = t.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.validEmail;
    }

    if (!formData.password) {
      newErrors.password = t.required;
    } else if (formData.password.length < 8) {
      newErrors.password = t.passwordMinLength;
    }

    if (type === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t.required;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t.passwordsNotMatch;
      }

      if (!formData.companyName.trim()) {
        newErrors.companyName = t.required;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'signup' && (
        <motion.div
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t.fullName} *
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 hover:shadow-md ${
                errors.fullName ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your full name"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            />
          </div>
          {errors.fullName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.fullName}
            </motion.p>
          )}
        </motion.div>
      )}

      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t.email} *
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 hover:shadow-md ${
              errors.email ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Enter your email address"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.email}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t.password} *
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 hover:shadow-md ${
              errors.password ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Create a strong password"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.password}
          </motion.p>
        )}
      </motion.div>

      {type === 'signup' && (
        <>
          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.confirmPassword}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t.confirmPassword}
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.companyName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.companyName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t.companyName}
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
              />
            </div>
            {errors.companyName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.companyName}
              </motion.p>
            )}
          </motion.div>
        </>
      )}

      {type === 'login' && (
        <motion.div
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="text-right"
        >
          <button
            type="button"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            style={{ color: 'var(--text-link)' }}
          >
            {t.forgotPassword}
          </button>
        </motion.div>
      )}

      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          whileHover={{ scale: loading ? 1 : 1.02, y: -1 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            type === 'login' ? t.login : t.signup
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}
