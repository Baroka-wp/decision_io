import React from 'react';
import CalendarPage from '../../pages/CalendarPage';
import ProfilePage from '../../pages/ProfilePage';
import SettingsPage from '../../pages/SettingsPage';
import RevenuePage from '../../pages/RevenuePage';
import AppointmentPage from '../../pages/AppointmentPage';
import CoachDashboard from '../../pages/CoachDashboard';

const MainContent = ({ activePage, menuItems, isSidebarOpen }) => {
  return (
    <main
      className={`
        min-h-screen transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
        pt-16 px-6
      `}
    >
      <div className="max-w-7xl mx-auto">
        {/* <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          {menuItems.find((item) => item.id === activePage)?.label}
        </h2> */}

        {/* Affichage conditionnel pour chaque page */}
        {/* {activePage === 'calendar' ? (
          <CalendarPage />
        ) : activePage === 'profile' ? (
          <ProfilePage />
        ) : activePage === 'settings' ? (
          <SettingsPage />
        ) : activePage === 'revenue' ? (
          <RevenuePage />
        ) : activePage === 'appointment' ? (
          <CoachDashboard />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Contenu de la page {activePage}
            </p>
          </div>
        )} */}
        {activePage === 'Calendrier' && <CalendarPage />}
        {activePage === 'Profile' && <ProfilePage />}
        {activePage === 'Paramètres' && <SettingsPage />}
        {activePage === 'Vos Revenues' && <RevenuePage />}
        {activePage === 'Mes rendez-vous' && <CoachDashboard />}
      </div>
    </main>
  );
};

export default MainContent;
