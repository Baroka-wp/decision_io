import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Domaines from './pages/Domaines';
import StartupEvaluation from './pages/StartupEvaluation';
import CoachesList from './pages/CoachesList';
import CoachDashboard from './pages/CoachDashboard';
import CoachLogin from './pages/CoachLogin';

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