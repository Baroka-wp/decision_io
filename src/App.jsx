import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Domaines from './Domaines';
import StartupEvaluation from './StartupEvaluation';
import CoachesList from './CoachesList';
import CoachDashboard from './CoachDashboard';
import CoachLogin from './CoachLogin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Domaines />} />
          <Route path="/startup" element={<StartupEvaluation />} />
          <Route path="/coaches" element={<CoachesList />} />
          <Route path="/coach-login" element={<CoachLogin />} />
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;