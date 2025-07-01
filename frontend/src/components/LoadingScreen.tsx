import React from 'react';
import { motion } from 'framer-motion';
import { 
  School as SchoolIcon,
  Wifi as WifiIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

interface LoadingScreenProps {
  status: 'loading' | 'error' | 'connected';
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <WifiIcon style={{ fontSize: '2rem', color: 'white' }} />
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--danger-color), #f87171)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <ErrorIcon style={{ fontSize: '2rem', color: 'white' }} />
          </motion.div>
        );
      case 'connected':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--success-color), #34d399)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <CheckIcon style={{ fontSize: '2rem', color: 'white' }} />
          </motion.div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'var(--primary-color)';
      case 'error':
        return 'var(--danger-color)';
      case 'connected':
        return 'var(--success-color)';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center'
        }}
      >
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-2xl)',
          border: 'none',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          padding: 'var(--spacing-3xl)'
        }}>
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <SchoolIcon style={{ fontSize: '2.5rem', color: 'white' }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              color: 'var(--gray-900)',
              margin: '0 0 var(--spacing-sm) 0',
              fontWeight: 700,
              fontSize: '2rem'
            }}
          >
            Alumni Network Platform
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              color: 'var(--gray-600)',
              margin: '0 0 var(--spacing-2xl) 0',
              fontSize: '1.125rem'
            }}
          >
            Connecting alumni worldwide
          </motion.p>

          {/* Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-xl)',
              border: `2px solid ${getStatusColor()}20`
            }}
          >
            {/* Status Icon */}
            {getStatusIcon()}

            {/* Status Message */}
            <h3 style={{
              color: getStatusColor(),
              margin: '0 0 var(--spacing-sm) 0',
              fontWeight: 600,
              fontSize: '1.25rem'
            }}>
              {status === 'loading' && 'Connecting to Backend...'}
              {status === 'error' && 'Connection Failed'}
              {status === 'connected' && 'Backend Connected'}
            </h3>

            <p style={{
              color: 'var(--gray-700)',
              margin: 0,
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}>
              {message}
            </p>

            {/* Additional Info */}
            {status === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  marginTop: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: 'rgba(37, 99, 235, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(37, 99, 235, 0.2)'
                }}
              >
                <p style={{
                  color: 'var(--primary-color)',
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  💡 Make sure your backend server is running on port 8080
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  marginTop: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <p style={{
                  color: 'var(--danger-color)',
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  🔧 Please check your backend server and try refreshing the page
                </p>
              </motion.div>
            )}

            {status === 'connected' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  marginTop: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <p style={{
                  color: 'var(--success-color)',
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  ✅ All systems are operational and ready to use
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{
              marginTop: 'var(--spacing-xl)',
              padding: 'var(--spacing-lg)',
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: 'var(--spacing-lg)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--success-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm)'
                }}>
                  <CheckIcon style={{ fontSize: '1rem', color: 'white' }} />
                </div>
                <p style={{
                  color: 'var(--gray-700)',
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Frontend
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: status === 'connected' ? 'var(--success-color)' : 'var(--gray-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm)'
                }}>
                  {status === 'connected' ? (
                    <CheckIcon style={{ fontSize: '1rem', color: 'white' }} />
                  ) : (
                    <WifiIcon style={{ fontSize: '1rem', color: 'white' }} />
                  )}
                </div>
                <p style={{
                  color: 'var(--gray-700)',
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Backend
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: status === 'connected' ? 'var(--success-color)' : 'var(--gray-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm)'
                }}>
                  {status === 'connected' ? (
                    <CheckIcon style={{ fontSize: '1rem', color: 'white' }} />
                  ) : (
                    <WifiIcon style={{ fontSize: '1rem', color: 'white' }} />
                  )}
                </div>
                <p style={{
                  color: 'var(--gray-700)',
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Database
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 