import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NewsFeed from './components/NewsFeed';
import ExternalNews from './components/ExternalNews';
import LoadingScreen from './components/LoadingScreen';
import CalendarFab from './components/CalendarFab';
import Mentorship from './components/Mentorship';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
      // You could validate the token here if needed
      setUser({
        email: userEmail,
        firstName: localStorage.getItem('userFirstName') || '',
        lastName: localStorage.getItem('userLastName') || '',
        role: localStorage.getItem('userRole') || 'USER'
      });
      setIsAuthenticated(true);
    }

    // Check backend connection
    fetch('/api')
      .then(res => res.ok ? res.text() : Promise.reject('API not reachable'))
      .then(text => {
        setApiMessage(text);
        setIsLoading(false);
      })
      .catch(() => {
        setApiMessage('Could not connect to backend.');
        setIsLoading(false);
      });
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userFirstName', userData.firstName);
    localStorage.setItem('userLastName', userData.lastName);
    localStorage.setItem('userRole', userData.role);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegister = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userFirstName', userData.firstName);
    localStorage.setItem('userLastName', userData.lastName);
    localStorage.setItem('userRole', userData.role);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Determine loading screen status
  const getLoadingStatus = () => {
    if (isLoading) return 'loading';
    if (apiMessage === 'Hello from backend!') return 'connected';
    return 'error';
  };

  // If backend is not connected, show the loading screen
  if (apiMessage !== 'Hello from backend!') {
    return (
      <LoadingScreen
        status={getLoadingStatus()}
        message={apiMessage}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/news/external" element={<ExternalNews />} />
        <Route path="/*" element={
          isAuthenticated && user ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            showRegister ? (
              <Register onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
            )
          )
        } />
      </Routes>
      <CalendarFab />
    </Router>
  );
}

export default App;
