import React, { useState } from 'react';
import { Card, Container, Row, Col, Alert, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Work as WorkIcon,
  Article as NewsIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import Profile from './Profile';
import Events from './Events';
import Jobs from './Jobs';
import NewsFeed from './NewsFeed';
import Sidebar from './Sidebar';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(initialUser);

  const stats = [
    { label: 'Total Alumni', value: '2,847', icon: PeopleIcon, color: '#2563eb', change: '+12%' },
    { label: 'Active Events', value: '23', icon: EventIcon, color: '#f59e0b', change: '+5%' },
    { label: 'Job Postings', value: '156', icon: WorkIcon, color: '#8b5cf6', change: '+8%' },
    { label: 'News Articles', value: '89', icon: NewsIcon, color: '#06b6d4', change: '+15%' },
  ];

  const features = [
    { name: 'Profile Management', status: 'active', description: 'Complete profile customization with social links' },
    { name: 'Events Management', status: 'active', description: 'Create and manage alumni events' },
    { name: 'Job Board', status: 'active', description: 'Post and apply for job opportunities' },
    { name: 'News Feed', status: 'active', description: 'Stay updated with latest news' },
    { name: 'Alumni Directory', status: 'coming', description: 'Connect with fellow alumni' },
    { name: 'Mentorship Program', status: 'coming', description: 'Find mentors and mentees' },
  ];

  const renderContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
          >
            <Profile user={user} onLogout={onLogout} onProfileUpdate={setUser} />
          </motion.div>
        );
      case 'events':
        return (
          <motion.div
            key="events"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
          >
            <Events user={user} onLogout={onLogout} />
          </motion.div>
        );
      case 'jobs':
        return (
          <motion.div
            key="jobs"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
          >
            <Jobs />
          </motion.div>
        );
      case 'news':
        return (
          <motion.div
            key="news"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
          >
            <NewsFeed />
          </motion.div>
        );
      case 'dashboard':
      default:
        return (
          <motion.div
            key="dashboard"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
          >
            {/* Welcome Section */}
            <div className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Alert variant="success" style={{
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--spacing-xl)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--success-color), #34d399)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      <SchoolIcon />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, color: '#065f46', fontWeight: 700 }}>
                        Welcome back, {user.firstName}! 🎉
                      </h3>
                      <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: '#047857', fontSize: '1rem' }}>
                        Ready to connect with your alumni network and explore new opportunities?
                      </p>
                    </div>
                  </div>
                </Alert>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Col key={stat.label} lg={3} md={6} className="mb-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    >
                      <Card className="h-100" style={{
                        background: 'white',
                        borderRadius: 'var(--radius-xl)',
                        border: 'none',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden'
                      }}>
                        <Card.Body style={{ padding: 'var(--spacing-xl)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <p style={{
                                color: 'var(--gray-500)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                {stat.label}
                              </p>
                              <h2 style={{
                                color: 'var(--gray-900)',
                                margin: 'var(--spacing-sm) 0',
                                fontWeight: 700,
                                fontSize: '2rem'
                              }}>
                                {stat.value}
                              </h2>
                              <Badge style={{
                                background: stat.color,
                                color: 'white',
                                fontSize: '0.75rem',
                                padding: 'var(--spacing-xs) var(--spacing-sm)'
                              }}>
                                {stat.change}
                              </Badge>
                            </div>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: 'var(--radius-lg)',
                              background: `${stat.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: stat.color
                            }}>
                              <IconComponent style={{ fontSize: '1.5rem' }} />
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>
            
            {/* Features Grid */}
            <Row>
              <Col lg={8} className="mb-4">
                <Card style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: 'none',
                  boxShadow: 'var(--shadow-lg)',
                  height: '100%'
                }}>
                  <Card.Header style={{
                    background: 'var(--gray-50)',
                    borderBottom: '1px solid var(--gray-200)',
                    padding: 'var(--spacing-xl)',
                    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
                  }}>
                    <h4 style={{ margin: 0, color: 'var(--gray-900)', fontWeight: 600 }}>
                      Platform Features
                    </h4>
                    <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--gray-600)' }}>
                      Explore what's available in your alumni network
                    </p>
                  </Card.Header>
                  <Card.Body style={{ padding: 'var(--spacing-xl)' }}>
                    <Row>
                      {features.map((feature, index) => (
                        <Col key={feature.name} md={6} className="mb-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--spacing-md)',
                              padding: 'var(--spacing-md)',
                              borderRadius: 'var(--radius-lg)',
                              background: feature.status === 'active' ? 'var(--gray-50)' : 'var(--gray-100)',
                              border: `1px solid ${feature.status === 'active' ? 'var(--gray-200)' : 'var(--gray-300)'}`
                            }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: feature.status === 'active' ? 'var(--success-color)' : 'var(--gray-400)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0
                              }}>
                                <CheckIcon style={{ fontSize: '1rem' }} />
                              </div>
                              <div>
                                <h6 style={{
                                  margin: 0,
                                  color: 'var(--gray-900)',
                                  fontWeight: 600,
                                  fontSize: '0.875rem'
                                }}>
                                  {feature.name}
                                </h6>
                                <p style={{
                                  margin: 'var(--spacing-xs) 0 0 0',
                                  color: 'var(--gray-600)',
                                  fontSize: '0.75rem',
                                  lineHeight: 1.4
                                }}>
                                  {feature.description}
                                </p>
                                <Badge style={{
                                  background: feature.status === 'active' ? 'var(--success-color)' : 'var(--gray-500)',
                                  color: 'white',
                                  fontSize: '0.625rem',
                                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}>
                                  {feature.status}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4} className="mb-4">
                <Card style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: 'none',
                  boxShadow: 'var(--shadow-lg)',
                  height: '100%'
                }}>
                  <Card.Header style={{
                    background: 'var(--gray-50)',
                    borderBottom: '1px solid var(--gray-200)',
                    padding: 'var(--spacing-xl)',
                    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
                  }}>
                    <h4 style={{ margin: 0, color: 'var(--gray-900)', fontWeight: 600 }}>
                      System Status
                    </h4>
                  </Card.Header>
                  <Card.Body style={{ padding: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      {[
                        { name: 'Backend Connection', status: 'Active', color: 'var(--success-color)' },
                        { name: 'Database', status: 'Connected (H2)', color: 'var(--success-color)' },
                        { name: 'Authentication', status: 'Working', color: 'var(--success-color)' },
                        { name: 'Profile Management', status: 'Available', color: 'var(--success-color)' },
                        { name: 'Events Management', status: 'Available', color: 'var(--success-color)' },
                        { name: 'Job Postings', status: 'Available', color: 'var(--success-color)' },
                      ].map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) 0'
                          }}
                        >
                          <span style={{
                            color: 'var(--gray-700)',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            {item.name}
                          </span>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: item.color
                            }} />
                            <span style={{
                              color: item.color,
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {item.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        user={user}
      />
      
      <div style={{
        flex: 1,
        marginLeft: '280px',
        padding: 'var(--spacing-xl)',
        background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)',
        minHeight: '100vh'
      }}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard; 