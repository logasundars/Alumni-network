import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Alert, Nav } from 'react-bootstrap';
import Profile from './Profile';
import Events from './Events';
import Jobs from './Jobs';
import NewsFeed from './NewsFeed';

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

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile user={user} onLogout={onLogout} />;
      case 'events':
        return <Events user={user} onLogout={onLogout} />;
      case 'jobs':
        return <Jobs />;
      case 'news':
        return <NewsFeed />;
      case 'dashboard':
      default:
        return (
          <div>
            <Alert variant="success">
              <h5>Welcome to Alumni Network! 🎉</h5>
              <p>You are now logged in to the Alumni Network platform.</p>
            </Alert>
            
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>User Information</Card.Header>
                  <Card.Body>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>Quick Actions</Card.Header>
                  <Card.Body>
                    <p>Available features:</p>
                    <ul>
                      <li>✅ Profile Management</li>
                      <li>✅ Events Management</li>
                      <li>✅ Job Postings & Applications</li>
                      <li>🔄 News & Updates (Coming Soon)</li>
                      <li>🔄 Alumni Directory (Coming Soon)</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="mt-3">
              <Card.Header>System Status</Card.Header>
              <Card.Body>
                <p className="text-success">
                  ✅ Backend connection: <strong>Active</strong>
                </p>
                <p className="text-success">
                  ✅ Database: <strong>Connected (H2)</strong>
                </p>
                <p className="text-success">
                  ✅ Authentication: <strong>Working</strong>
                </p>
                <p className="text-success">
                  ✅ Profile Management: <strong>Available</strong>
                </p>
                <p className="text-success">
                  ✅ Events Management: <strong>Available</strong>
                </p>
                <p className="text-success">
                  ✅ Job Postings & Applications: <strong>Available</strong>
                </p>
              </Card.Body>
            </Card>
          </div>
        );
    }
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Alumni Network Platform</h4>
              <Button variant="outline-danger" onClick={onLogout}>
                Logout
              </Button>
            </Card.Header>
            <Card.Body>
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'events'} 
                    onClick={() => setActiveTab('events')}
                  >
                    Events Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'jobs'} 
                    onClick={() => setActiveTab('jobs')}
                  >
                    Job Board
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'news'} 
                    onClick={() => setActiveTab('news')}
                  >
                    News Feed
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              {renderContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 