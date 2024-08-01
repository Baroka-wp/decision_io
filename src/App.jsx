import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Domaines from './Domaines';
import CoachesList from './CoachesList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Domaines />} />
        <Route path="/coaches" element={<CoachesList />} />
      </Routes>
    </Router>
  );
}

export default App;