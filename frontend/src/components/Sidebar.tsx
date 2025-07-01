import React from 'react';
import { Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Work as WorkIcon,
  Article as NewsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon
} from '@mui/icons-material';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, color: '#2563eb' },
    { id: 'profile', label: 'Profile', icon: PersonIcon, color: '#10b981' },
    { id: 'events', label: 'Events', icon: EventIcon, color: '#f59e0b' },
    { id: 'jobs', label: 'Job Board', icon: WorkIcon, color: '#8b5cf6' },
    { id: 'news', label: 'News Feed', icon: NewsIcon, color: '#06b6d4' },
  ];

  return (
    <div className="sidebar">
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          width: '280px',
          height: '100vh',
          background: 'linear-gradient(180deg, var(--gray-900) 0%, var(--gray-800) 100%)',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          boxShadow: 'var(--shadow-xl)',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-xl)',
          borderBottom: '1px solid var(--gray-700)',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <SchoolIcon style={{ 
              fontSize: '2.5rem', 
              color: 'var(--primary-color)',
              marginBottom: 'var(--spacing-sm)'
            }} />
            <h4 style={{ 
              color: 'white', 
              margin: 0,
              fontWeight: 700,
              fontSize: '1.25rem'
            }}>
              Alumni Network
            </h4>
            <p style={{ 
              color: 'var(--gray-400)', 
              margin: 'var(--spacing-xs) 0 0 0',
              fontSize: '0.875rem'
            }}>
              Connect • Grow • Succeed
            </p>
          </motion.div>
        </div>

        {/* User Info */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--gray-700)',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.125rem'
            }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <p style={{ 
                color: 'white', 
                margin: 0,
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {user.firstName} {user.lastName}
              </p>
              <p style={{ 
                color: 'var(--gray-400)', 
                margin: 0,
                fontSize: '0.75rem'
              }}>
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Nav className="flex-column" style={{ padding: 'var(--spacing-lg) 0' }}>
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Nav.Link
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md) var(--spacing-xl)',
                    color: isActive ? 'white' : 'var(--gray-300)',
                    background: isActive ? `linear-gradient(90deg, ${item.color}20, transparent)` : 'transparent',
                    borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all var(--transition-normal)',
                    cursor: 'pointer',
                    margin: 'var(--spacing-xs) 0'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--gray-300)';
                    }
                  }}
                >
                  <IconComponent style={{ 
                    fontSize: '1.25rem',
                    color: isActive ? item.color : 'inherit'
                  }} />
                  <span style={{ 
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem'
                  }}>
                    {item.label}
                  </span>
                </Nav.Link>
              </motion.div>
            );
          })}
        </Nav>

        {/* Logout */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'var(--spacing-lg)',
          borderTop: '1px solid var(--gray-700)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <LogoutIcon style={{ fontSize: '1.125rem' }} />
              Logout
            </motion.span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar; 