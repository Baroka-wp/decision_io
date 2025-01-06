// MenuItem.jsx
import React from 'react';

const MenuItem = ({ item, activePage, setActivePage }) => {
  return (
    <button
      onClick={() => setActivePage(item.id)}
      className={`
        w-full flex items-center px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors
        ${activePage === item.id ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' : ''}
      `}
    >
      {item.icon}
      <span className="ml-3 font-medium">{item.label}</span>
    </button>
  );
};

export default MenuItem;
