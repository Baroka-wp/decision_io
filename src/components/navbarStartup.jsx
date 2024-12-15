import React from 'react';
import { User } from "lucide-react"; // Assurez-vous d'importer l'icône User

const NavbarStartup = () => {
  return (
    <div className='p-4 md:p-8 bg-gradient-to-r from-fuschia-100 to-violet-100'>
    <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full ">
        <header className="flex justify-between items-center mb-8 ">
        <h1 className="text-3xl font-bold text-fuschia-600">Décision</h1>
        <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-fuschia-600">À propos</a>
            <a href="#" className="text-gray-600 hover:text-fuschia-600">Services</a>
            <a href="#" className="text-gray-600 hover:text-fuschia-600">Contact</a>
        </nav>
        <User size={32} className="text-fuschia-600" />
        </header>
    </div>
    </div>
  );
};

export default NavbarStartup;
