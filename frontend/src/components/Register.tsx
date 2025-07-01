import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import axios from 'axios';

interface RegisterProps {
  onRegister: (token: string, userData: any) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        const user = {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role
        };
        onRegister(response.data.token, user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <Card style={{
          background: 'white',
          borderRadius: 'var(--radius-2xl)',
          border: 'none',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            borderBottom: '1px solid var(--gray-200)'
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--success-color), #34d399)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <SchoolIcon style={{ fontSize: '2.5rem', color: 'white' }} />
              </div>
              <h2 style={{
                color: 'var(--gray-900)',
                margin: 0,
                fontWeight: 700,
                fontSize: '1.75rem'
              }}>
                Join Alumni Network
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                margin: 'var(--spacing-sm) 0 0 0',
                fontSize: '1rem'
              }}>
                Create your account and connect with fellow alumni
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <Card.Body style={{ padding: 'var(--spacing-2xl)' }}>
            <Form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="danger" style={{
                    borderRadius: 'var(--radius-lg)',
                    border: 'none',
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    color: '#dc2626',
                    fontSize: '0.875rem'
                  }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              {/* Name Fields */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ flex: 1 }}
                >
                  <Form.Group>
                    <Form.Label style={{
                      color: 'var(--gray-700)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      First Name
                    </Form.Label>
                    <div style={{ position: 'relative' }}>
                      <PersonIcon style={{
                        position: 'absolute',
                        left: 'var(--spacing-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--gray-400)',
                        fontSize: '1.25rem',
                        zIndex: 1
                      }} />
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                        style={{
                          paddingLeft: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                          borderRadius: 'var(--radius-lg)',
                          border: '2px solid var(--gray-200)',
                          fontSize: '1rem',
                          height: '48px',
                          transition: 'all var(--transition-fast)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--primary-color)';
                          e.target.style.boxShadow = '0 0 0 3px rgb(37 99 235 / 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--gray-200)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{ flex: 1 }}
                >
                  <Form.Group>
                    <Form.Label style={{
                      color: 'var(--gray-700)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Last Name
                    </Form.Label>
                    <div style={{ position: 'relative' }}>
                      <PersonIcon style={{
                        position: 'absolute',
                        left: 'var(--spacing-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--gray-400)',
                        fontSize: '1.25rem',
                        zIndex: 1
                      }} />
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                        style={{
                          paddingLeft: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                          borderRadius: 'var(--radius-lg)',
                          border: '2px solid var(--gray-200)',
                          fontSize: '1rem',
                          height: '48px',
                          transition: 'all var(--transition-fast)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--primary-color)';
                          e.target.style.boxShadow = '0 0 0 3px rgb(37 99 235 / 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--gray-200)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </Form.Group>
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Form.Group className="mb-3">
                  <Form.Label style={{
                    color: 'var(--gray-700)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Email Address
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <EmailIcon style={{
                      position: 'absolute',
                      left: 'var(--spacing-md)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--gray-400)',
                      fontSize: '1.25rem',
                      zIndex: 1
                    }} />
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      style={{
                        paddingLeft: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid var(--gray-200)',
                        fontSize: '1rem',
                        height: '48px',
                        transition: 'all var(--transition-fast)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-color)';
                        e.target.style.boxShadow = '0 0 0 3px rgb(37 99 235 / 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--gray-200)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </Form.Group>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Form.Group className="mb-3">
                  <Form.Label style={{
                    color: 'var(--gray-700)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Password
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <LockIcon style={{
                      position: 'absolute',
                      left: 'var(--spacing-md)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--gray-400)',
                      fontSize: '1.25rem',
                      zIndex: 1
                    }} />
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      style={{
                        paddingLeft: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                        paddingRight: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid var(--gray-200)',
                        fontSize: '1rem',
                        height: '48px',
                        transition: 'all var(--transition-fast)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-color)';
                        e.target.style.boxShadow = '0 0 0 3px rgb(37 99 235 / 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--gray-200)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 'var(--spacing-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--gray-400)',
                        cursor: 'pointer',
                        padding: 'var(--spacing-xs)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--gray-600)';
                        e.currentTarget.style.background = 'var(--gray-100)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--gray-400)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                  </div>
                </Form.Group>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: 'var(--gray-700)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    Confirm Password
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <LockIcon style={{
                      position: 'absolute',
                      left: 'var(--spacing-md)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--gray-400)',
                      fontSize: '1.25rem',
                      zIndex: 1
                    }} />
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      style={{
                        paddingLeft: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                        paddingRight: 'calc(var(--spacing-md) + 1.25rem + var(--spacing-sm))',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid var(--gray-200)',
                        fontSize: '1rem',
                        height: '48px',
                        transition: 'all var(--transition-fast)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary-color)';
                        e.target.style.boxShadow = '0 0 0 3px rgb(37 99 235 / 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--gray-200)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: 'var(--spacing-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--gray-400)',
                        cursor: 'pointer',
                        padding: 'var(--spacing-xs)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--gray-600)';
                        e.currentTarget.style.background = 'var(--gray-100)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--gray-400)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                  </div>
                </Form.Group>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--success-color), #34d399)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-md)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    height: '48px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}
              >
                <p style={{
                  color: 'var(--gray-600)',
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-color)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.875rem'
                    }}
                  >
                    Sign in here
                  </button>
                </p>
              </motion.div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register; 