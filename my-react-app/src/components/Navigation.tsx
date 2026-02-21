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
    <nav className="sticky top-0 z-50 shadow-lg" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 60%, #bfdbfe 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-28 lg:h-32">

          {/* Logo */}
          <img
            onClick={() => handleNavigate('home')}
            src={logo}
            alt="CivicCast Logo"
            className="h-45 md:h-45 w-auto header__logo cursor-pointer"
          />

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="relative flex flex-col items-center px-4 md:px-6 py-2 rounded-xl transition-all duration-200 group"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
                  }}
                >
                  {/* English label */}
                  <span
                    className="text-sm md:text-base lg:text-lg font-semibold tracking-wide whitespace-nowrap transition-colors duration-200"
                    style={{ color: isActive ? '#ffffff' : '#1e3a5f' }}
                  >
                    {item.label}
                  </span>

                  {/* Hindi label */}
                  <span
                    className="text-[9px] md:text-[11px] lg:text-xs whitespace-nowrap tracking-wide transition-colors duration-200"
                    style={{ color: isActive ? '#bfdbfe' : '#5b7ca8' }}
                  >
                    {item.labelHi}
                  </span>

                  {/* Hover underline accent (only when not active) */}
                  {!isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-3/4"
                    />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}
