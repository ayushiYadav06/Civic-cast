import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import CategoryForm from './pages/admin/CategoryForm';
import SubCategories from './pages/admin/SubCategories';
import SubCategoryForm from './pages/admin/SubCategoryForm';
import Operators from './pages/admin/Operators';
import OperatorForm from './pages/admin/OperatorForm';
import News from './pages/admin/News';
import NewsForm from './pages/admin/NewsForm';
import NewsView from './pages/admin/NewsView';
import NewsReject from './pages/admin/NewsReject';
import Advertisements from './pages/admin/Advertisements';
import AdvertisementForm from './pages/admin/AdvertisementForm';
import NewsDetail from './pages/NewsDetail';

// Public frontend routes (existing)
import { Navigation } from './components/Navigation';
import { SecondHeader } from './components/SecondHeader';
import { Home } from './components/Home';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useState } from 'react';

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

function PublicApp() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'local-governance':
      case 'peoples-voice':
      case 'progress-path':
      case 'criminal-alert':
      case 'ground-report':
      case 'civic-cost-special':
      case 'accountability-meter':
      case 'todays-question':
      case 'direct-from-citizen':
      case 'india-on-track':
        return (
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
              {currentPage
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h1>
            <p className="text-center text-gray-600">
              Content for this section is coming soon...
            </p>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <SecondHeader />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<ProtectedRoute requireAdmin><Categories /></ProtectedRoute>} />
            <Route path="categories/new" element={<ProtectedRoute requireAdmin><CategoryForm /></ProtectedRoute>} />
            <Route path="categories/:id/edit" element={<ProtectedRoute requireAdmin><CategoryForm /></ProtectedRoute>} />
            <Route path="sub-categories" element={<ProtectedRoute requireAdmin><SubCategories /></ProtectedRoute>} />
            <Route path="sub-categories/new" element={<ProtectedRoute requireAdmin><SubCategoryForm /></ProtectedRoute>} />
            <Route path="sub-categories/:id/edit" element={<ProtectedRoute requireAdmin><SubCategoryForm /></ProtectedRoute>} />
            <Route path="operators" element={<ProtectedRoute requireAdmin><Operators /></ProtectedRoute>} />
            <Route path="operators/new" element={<ProtectedRoute requireAdmin><OperatorForm /></ProtectedRoute>} />
            <Route path="operators/:id/edit" element={<ProtectedRoute requireAdmin><OperatorForm /></ProtectedRoute>} />
            <Route path="news" element={<News />} />
            <Route path="news/new" element={<NewsForm />} />
            <Route path="news/:id/edit" element={<NewsForm />} />
            <Route path="news/:id/view" element={<NewsView />} />
            <Route path="news/:id/reject" element={<NewsReject />} />
            <Route path="advertisements" element={<Advertisements />} />
            <Route path="advertisements/new" element={<AdvertisementForm />} />
            <Route path="advertisements/:id/edit" element={<AdvertisementForm />} />
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Public Routes */}
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/*" element={<PublicApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
