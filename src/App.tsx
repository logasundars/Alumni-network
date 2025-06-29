import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';

function App() {
  const [apiMessage, setApiMessage] = useState<string>('Loading...');

  useEffect(() => {
    fetch('/api')
      .then(res => res.ok ? res.text() : Promise.reject('API not reachable'))
      .then(text => setApiMessage(text))
      .catch(() => setApiMessage('Could not connect to backend.'));
  }, []);

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

export default App; 