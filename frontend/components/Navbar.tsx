import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CareezyLogo } from './CareezyLogo';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-teal-600 font-bold' : 'text-slate-600 hover:text-teal-600 font-medium';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
              <CareezyLogo className="h-12" />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className={`${isActive('/features')} transition-colors`}>Features</Link>
            <Link to="/templates" className={`${isActive('/templates')} transition-colors`}>Templates</Link>
            <Link to="/pricing" className={`${isActive('/pricing')} transition-colors`}>Pricing</Link>
            <Link 
              to="/dashboard" 
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Features</Link>
            <Link to="/templates" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Templates</Link>
            <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Pricing</Link>
            <Link to="/dashboard" className="block w-full text-center mt-4 bg-teal-600 text-white px-4 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};