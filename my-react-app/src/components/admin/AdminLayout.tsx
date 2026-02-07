import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  FolderTree,
  Users,
  Newspaper,
  Megaphone,
  Bell,
  LogOut,
  Menu,
  X,
  Settings,
  Divide,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';
import logoImage from '../../assets/logo.png';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
  { icon: FolderTree, label: 'Sub-Categories', path: '/admin/sub-categories' },
  { icon: Users, label: 'Operators', path: '/admin/operators' },
  { icon: Newspaper, label: 'News', path: '/admin/news' },
  { icon: Megaphone, label: 'Advertisements', path: '/admin/advertisements' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Filter menu items based on user role
  const filteredMenuItems = user?.role === 'operator' 
    ? menuItems.filter(item => item.label === 'News' || item.label === 'Advertisements')
    : menuItems;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex pt-[65px]">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-[65px] left-0 z-30 h-[calc(100vh-65px)] w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50">
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="CivicCast Logo" className="h-8 w-auto object-contain" />
                <h1 className="text-sm font-semibold text-gray-900 hidden sm:block">CivicCast</h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-left transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 lg:ml-64 min-h-[calc(100vh-65px)] w-full">
          <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
