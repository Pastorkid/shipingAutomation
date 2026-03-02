'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Linkedin, 
  Twitter, 
  Youtube, 
  Slack, 
  Mail, 
  Send,
  ArrowRight,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';


interface FooterProps {
  showNewsletter?: boolean;
  showHelpButton?: boolean;
}

export default function Footer({ showNewsletter = true, showHelpButton = true }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { t } = useTranslation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribing(false);
    setEmail('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Slack, href: '#', label: 'Slack' },
  ];

  const quickLinks = [
    { href: '/dashboard', label: t.dashboard },
    { href: '#features', label: t.features },
    { href: '#pricing', label: t.pricing },
    { href: '#about', label: t.about },
    { href: '#contact', label: t.contact },
  ];

  const resourceLinks = [
    { href: '/privacy', label: t.privacyPolicy },
    { href: '/terms', label: t.termsOfService },
    { href: '/help', label: t.helpCenter },
  ];

  return (
    <>
      <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--background-footer)', borderTop: `1px solid var(--input-border)` }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: 'var(--accent-green)' }}></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <Image
                        src="/myLogo.png"
                        alt="RevOps AI Logo"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 32px, 40px"
                      />
                    </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl" style={{ color: 'var(--text-heading)' }}>RevOps AI</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.tagline}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t.companyDescription}
              </p>
              
              {/* Social Media Links */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>{t.socialMedia}</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                      style={{ 
                        backgroundColor: 'var(--background-card)', 
                        border: `1px solid var(--input-border)` 
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: 'var(--primary)',
                        color: 'white'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>{t.quickLinks}</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-sm transition-colors flex items-center group"
                      style={{ color: 'var(--text-secondary)' }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="group-hover:underline">{link.label}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>{t.resources}</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-sm transition-colors flex items-center group"
                      style={{ color: 'var(--text-secondary)' }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="group-hover:underline">{link.label}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            {showNewsletter && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>{t.newsletter}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.newsletterDesc}</p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      style={{ 
                        backgroundColor: 'var(--input-bg)', 
                        borderColor: 'var(--input-border)',
                        color: 'var(--input-text)'
                      }}
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-placeholder)' }} />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center space-x-2 text-sm transition-colors disabled:opacity-50"
                    style={{ backgroundColor: 'var(--primary)' }}
                    whileHover={{ scale: isSubscribing ? 1 : 1.02 }}
                    whileTap={{ scale: isSubscribing ? 1 : 0.98 }}
                  >
                    <span>{isSubscribing ? t.subscribing : t.subscribe}</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Copyright */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t text-center"
            style={{ borderColor: 'var(--input-border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t.copyright}
            </p>
          </motion.div>
        </motion.div>
      </footer>

      {/* Floating Help Button */}
      {showHelpButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50"
          style={{ backgroundColor: 'var(--accent-green)' }}
          onClick={() => {
            // Handle help chat
            console.log('Help chat clicked');
          }}
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </>
  );
}
