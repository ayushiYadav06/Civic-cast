import logo from "../assets/logo.png";
import React from 'react';

type PageId = 
  | 'home' 
  | 'about' 
  | 'contact';

interface NavigationProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  labelHi: string;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', labelHi: 'होम' },
    { id: 'about', label: 'About', labelHi: 'हमारे बारे में' },
    { id: 'contact', label: 'Contact', labelHi: 'संपर्क करें' },
  ];

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white to-blue-100 shadow-md">
      <div className="container mx-auto px-4">
<div className="flex items-center justify-between h-20 md:h-28 lg:h-32">
          <img 
            onClick={() => handleNavigate('home')} 
            src={logo} 
            alt="CivicCast Logo" 
            className="h-45 md:h-45 w-auto header__logo cursor-pointer" 
          />

          {/* Navigation Links */}
          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center px-2 md:px-3 py-1 transition-colors rounded ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm md:text-base lg:text-lg whitespace-nowrap text-center font-medium">{item.label}</span>
                <span className="text-[10px] md:text-xs whitespace-nowrap text-center">{item.labelHi}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}



