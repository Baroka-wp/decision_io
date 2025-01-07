import React from 'react';
import { Bell } from 'lucide-react';

const Navbar = ({ activePage }) => {
  // Données du coach (à remplacer par les données réelles)
  const coachProfile = {
    name: 'John Doe',
    photo: 'https://via.placeholder.com/40', // URL de la photo du coach
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Titre de la page active */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-violet-600 px-72">
              {activePage}
            </h1>
          </div>

          {/* Côté droit : Notifications et Profil du coach */}
          <div className="flex items-center space-x-4">
            {/* Icône de notification */}
            <button className="p-2 text-gray-600 hover:text-fuschia-600 relative">
              <Bell className="w-6 h-6" />
              {/* Badge de notification (optionnel) */}
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                3
              </span>
            </button>

            {/* Photo du coach */}
            <div className="flex items-center space-x-2">
              <img
                src={coachProfile.photo}
                alt={coachProfile.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">
                {coachProfile.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;