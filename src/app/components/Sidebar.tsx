import React, { useState } from "react";

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger menu button */}
      <button
        className="fixed right-4 top-4 z-50 p-2 bg-gray-200 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        {/* Icon changes based on sidebar state */}
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-gray-100 shadow-lg overflow-y-auto p-4 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default Sidebar;
