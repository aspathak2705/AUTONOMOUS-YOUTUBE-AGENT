import React from 'react';
import { Dashboard } from './pages/Dashboard';

export const App: React.FC = () => {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Dashboard />
    </main>
  );
};

export default App;
