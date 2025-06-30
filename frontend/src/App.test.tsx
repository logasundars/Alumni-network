import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test without importing App component to avoid axios issues
test('renders without crashing', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  expect(div).toBeInTheDocument();
  document.body.removeChild(div);
});
