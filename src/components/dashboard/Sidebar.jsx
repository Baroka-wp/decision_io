import React from 'react';
import { Menu, X } from 'lucide-react';
import MenuItem from './MenuItem';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, menuItems, activePage, setActivePage }) => {
  return (
    <aside className={`
      fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-violet-600">Dashboard</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;