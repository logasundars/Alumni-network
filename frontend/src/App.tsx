import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

function App() {
  const [apiMessage, setApiMessage] = useState<string>('Loading...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    fetch('/api')
      .then(res => res.ok ? res.text() : Promise.reject('API not reachable'))
      .then(text => setApiMessage(text))
      .catch(() => setApiMessage('Could not connect to backend.'));
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegister = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // If backend is not connected, show the original status card
  if (apiMessage !== 'Hello from backend!') {
    return (
      <Container className="d-flex vh-100 align-items-center justify-content-center">
        <Card style={{ minWidth: 400 }} className="shadow">
          <Card.Body>
            <Card.Title className="mb-4 text-primary text-center" as="h1">Alumni Network Platform</Card.Title>
            <Card.Subtitle className="mb-2 text-muted text-center">Backend status:</Card.Subtitle>
            <div className="text-center">
              {apiMessage === 'Loading...' ? <Spinner animation="border" /> : <span>{apiMessage}</span>}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // If authenticated, show dashboard
  if (isAuthenticated && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show authentication forms
  if (showRegister) {
    return <Register onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />;
}

export default App;
