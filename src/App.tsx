import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

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

export default function App() {
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
              {currentPage.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
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
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
