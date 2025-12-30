import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavbarProps {
  menuItems: MenuItem[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ menuItems, currentPage, setCurrentPage, theme = 'light', toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === 'dark';

  const navClass = isDark
    ? "bg-gray-900 border-b border-gray-800 text-white"
    : "bg-white border-b border-gray-100 text-gray-900";

  return (
    <nav className={`${navClass} shadow-sm sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
              <div className="relative w-16 h-16 flex items-center justify-center overflow-hidden bg-transparent -mt-2">
                <div
                  className={`w-full h-full transform transition-all duration-500 group-hover:scale-110 ${isDark
                      ? 'mix-blend-screen contrast-[300%] brightness-[1.6]'
                      : 'mix-blend-multiply contrast-[200%] brightness-[1.1]'
                    }`}
                  style={{
                    backgroundImage: `url(${isDark ? '/logo-dark-raw.jpg' : '/logo-light-raw.jpg'})`,
                    backgroundSize: '155%',
                    backgroundPosition: 'center 35%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
              <span className={`text-xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cinema <span className="text-blue-600">Journal</span>
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle - Desktop */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 mr-2 rounded-full transition-colors border ${isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white border-gray-700 hover:border-gray-600"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300"
                  }`}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === item.id
                  ? isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-50 text-blue-600'
                  : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <span className={currentPage === item.id ? 'text-blue-500' : 'text-gray-400'}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button and Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-blue-100"
              >
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-100 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden py-4 border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="container mx-auto px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-colors ${currentPage === item.id
                  ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                  : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;