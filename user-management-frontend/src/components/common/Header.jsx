import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            UserManagement
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md">
              Dashboard
            </Link>
            <Link to="/users" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md">
              Users
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md">
                Admin
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md px-3 py-2"
                aria-expanded={isProfileOpen}
              >
                <span>{user?.firstName || 'User'}</span>
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/users"
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 