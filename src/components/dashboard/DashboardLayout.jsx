import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileSidebarToggle from './MobileSidebarToggle';
import MainContent from './MainContent';
import Navbar from './Navbar'; // Importe la Navbar
import { Calendar, Settings, User, Clock, DollarSign } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Mes rendez-vous')

  const menuItems = [
    { id: 'Mes rendez-vous', label: 'Mes rendez-vous', icon: <Clock className="w-5 h-5" /> },
    { id: 'Calendrier', label: 'Calendrier', icon: <Calendar className="w-5 h-5" /> },
    { id: 'Profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'Paramètres', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
    { id: 'Vos Revenues', label: 'Mes revenus', icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <MobileSidebarToggle 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Navbar */}
      <Navbar activePage={activePage} />

      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        menuItems={menuItems}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main content */}
      <MainContent 
        activePage={activePage} 
        menuItems={menuItems}
        isSidebarOpen={isSidebarOpen} 
      />
    </div>
  );
};

export default DashboardLayout;