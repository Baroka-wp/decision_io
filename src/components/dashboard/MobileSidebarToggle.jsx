// MobileSidebarToggle.jsx
import React from 'react';
import { Menu, X } from 'lucide-react';

const MobileSidebarToggle = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <button 
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
    >
      {isSidebarOpen ? 
        <X className="w-6 h-6" /> : 
        <Menu className="w-6 h-6" />
      }
    </button>
  );
};

export default MobileSidebarToggle;
