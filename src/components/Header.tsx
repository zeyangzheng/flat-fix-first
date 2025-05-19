
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-primary">PropertyCare</Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Tenant Portal
              </Link>
              <Link to="/contractor" className="text-gray-600 hover:text-primary transition-colors">
                Contractor Portal
              </Link>
            </nav>
          </div>
          <div>
            {/* This would be replaced with actual user management in a real app */}
            <button className="btn-primary">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
