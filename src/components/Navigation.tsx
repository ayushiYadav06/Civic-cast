import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from "../assets/logo.png";
import React from 'react';

type PageId = 
  | 'home' 
  | 'about' 
  | 'contact'
  | 'local-governance'
  | 'peoples-voice'
  | 'progress-path'
  | 'criminal-alert'
  | 'ground-report'
  | 'civic-cost-special'
  | 'accountability-meter'
  | 'todays-question'
  | 'direct-from-citizen'
  | 'india-on-track';

interface NavigationProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  labelHi: string;
  subMenu?: Array<{ id: string; label: string; labelHi: string }>;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', labelHi: 'होम' },
    { 
      id: 'local-governance', 
      label: 'Local Governance', 
      labelHi: 'स्थानीय सुशासन',
      subMenu: [
        { id: 'sub-1', label: 'City News', labelHi: 'आपके शहर/ इलाके की हर खबर' },
      ]
    },
    { 
      id: 'peoples-voice', 
      label: "People's Voice", 
      labelHi: 'जनता की आवाज',
      subMenu: [
        { id: 'sub-1', label: 'Citizen Issues', labelHi: 'सीधे नागरिकों द्वारा उठाए गए मुद्दे और जनमत' },
      ]
    },
    { 
      id: 'progress-path', 
      label: 'Progress Path', 
      labelHi: 'प्रगति पथ',
      subMenu: [
        { id: 'sub-1', label: 'Development Works', labelHi: 'आपके क्षेत्र में चल रहे विकास कार्यों की गति' },
      ]
    },
    { 
      id: 'criminal-alert', 
      label: 'Crime Alert', 
      labelHi: 'आपराधिक सतर्कता',
      subMenu: [
        { id: 'sub-1', label: 'Crime Reports', labelHi: 'अपराध और सुरक्षा से जुड़ी जरूरी जानकारी' },
      ]
    },
    { 
      id: 'ground-report', 
      label: 'Ground Report', 
      labelHi: 'ग्राउंड रिपोर्ट',
      subMenu: [
        { id: 'sub-1', label: 'Field Reports', labelHi: 'जमीनी हकीकत और सच्चाई' },
      ]
    },
    { 
      id: 'civic-cost-special', 
      label: 'Civic Cast Special', 
      labelHi: 'Civic कॉस्ट स्पेशल',
      subMenu: [
        { id: 'sub-1', label: 'Exclusive Stories', labelHi: 'जो खबरें आपको कहीं और नहीं मिलेंगी' },
      ]
    },
    { 
      id: 'accountability-meter', 
      label: 'Accountability Meter', 
      labelHi: 'जवाबदेही मीटर',
      subMenu: [
        { id: 'sub-1', label: 'Department Performance', labelHi: 'कौन सा विभाग आपके वादे निभा रहा' },
      ]
    },
    { 
      id: 'todays-question', 
      label: "Today's Question", 
      labelHi: 'आज का सवाल',
      subMenu: [
        { id: 'sub-1', label: 'Daily Questions', labelHi: 'जिस मुद्दे पर शहर को सोचना जरूरी' },
      ]
    },
    { 
      id: 'direct-from-citizen', 
      label: 'Direct from Citizen', 
      labelHi: 'सीधे नागरिक से',
      subMenu: [
        { id: 'sub-1', label: 'Citizen Stories', labelHi: 'किसी एक नागरिक के जरूरी अनुभव की कहानी' },
      ]
    },
    { 
      id: 'india-on-track', 
      label: 'India on Track', 
      labelHi: 'पटरी पर भारत',
      subMenu: [
        { id: 'sub-1', label: 'Railway News', labelHi: 'भारतीय रेल्वे की कहानी' },
      ]
    },    
    { id: 'about', label: 'About', labelHi: 'हमारे बारे में' },
    { id: 'contact', label: 'Contact', labelHi: 'संपर्क करें' },
  ];

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-0 md:px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
         
            <img   onClick={() => handleNavigate('home')} src={logo} alt="CivicCast Logo" className="h-30 md:h-40 w-auto header__logo" />
         

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto max-w-[calc(100vw-200px)]">
            {navItems.map((item) => {
              if (item.subMenu) {
                return (
                  <div
                    key={item.id}
                    ref={(el) => (dropdownRefs.current[item.id] = el)}
                    className="relative flex-shrink-0"
                  >
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`flex flex-col items-center px-2 py-1 transition-colors rounded min-w-[80px] ${
                        currentPage === item.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-[10px] xl:text-xs whitespace-nowrap text-center leading-tight">{item.label}</span>
                      <span className="text-[9px] xl:text-[10px] whitespace-nowrap text-center leading-tight">{item.labelHi}</span>
                      <ChevronDown 
                        size={10} 
                        className={`transition-transform mt-0.5 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                        {item.subMenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavigate(item.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <div className="flex flex-col">
                              <span>{subItem.label}</span>
                              <span className="text-xs text-gray-500">{subItem.labelHi}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex flex-col items-center px-2 py-1 transition-colors rounded flex-shrink-0 min-w-[60px] ${
                    currentPage === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] xl:text-xs whitespace-nowrap text-center leading-tight">{item.label}</span>
                  <span className="text-[9px] xl:text-[10px] whitespace-nowrap text-center leading-tight">{item.labelHi}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 max-h-[calc(100vh-80px)] overflow-y-auto">
            {navItems.map((item) => {
              const isDropdownOpen = openDropdown === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.subMenu) {
                        toggleDropdown(item.id);
                      } else {
                        handleNavigate(item.id);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-gray-600">{item.labelHi}</span>
                    </div>
                    {item.subMenu && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {item.subMenu && isDropdownOpen && (
                    <div className="bg-gray-50 border-l-4 border-blue-600">
                      {item.subMenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigate(item.id)}
                          className="w-full text-left px-8 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span>{subItem.label}</span>
                            <span className="text-xs text-gray-500">{subItem.labelHi}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}