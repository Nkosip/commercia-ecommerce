import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/UseCart';
import { useAuth } from '../context/UseAuth';
import { getUserInitials, getUserDisplayName } from '../utils/auth';

const NavLink = ({ to, label, isActive, closeMenu }) => (
  <Link
    to={to}
    onClick={closeMenu}
    className={`block text-lg font-medium transition-colors ${
      isActive(to)
        ? 'text-red-600'
        : 'text-gray-700 hover:text-red-600'
    }`}
  >
    {label}
  </Link>
);

const Header = () => {
  const { getCartCount, cartItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/ATSlogo.png"
              alt="Afrika Tikkun Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAdmin() ? (
              // Admin Navigation
              <>
                <NavLink to="/admin/products" label="Products" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/admin/orders" label="Orders" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/admin" label="Dashboard" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
              </>
            ) : (
              // Regular User Navigation
              <>
                <NavLink to="/" label="Home" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/shop" label="Shop" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                
                {/* Cart */}
                <Link to="/cart" className="relative inline-block">
                  <i className="fa-solid fa-cart-shopping text-2xl text-gray-700 hover:text-red-600 transition-colors"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full min-w-[24px] h-6 flex items-center justify-center text-xs font-bold px-1.5 shadow-lg border-2 border-white z-10">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600"
                >
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-semibold">
                    {getUserInitials(user)}
                  </div>
                  <span className="text-sm font-medium">{getUserDisplayName(user)}</span>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                      {!isAdmin() && (
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${!isAdmin() ? 'border-t' : ''}`}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <NavLink to="/login" label="Login" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {/* User Info in Mobile Menu */}
            {user && (
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-semibold">
                  {getUserInitials(user)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{getUserDisplayName(user)}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            {isAdmin() ? (
              // Admin Mobile Navigation
              <>
                <NavLink to="/admin/products" label="Products" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/admin/orders" label="Orders" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/admin" label="Dashboard" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
              </>
            ) : (
              // Regular User Mobile Navigation
              <>
                <NavLink to="/" label="Home" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/shop" label="Shop" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
                <NavLink to="/cart" label={`Cart (${cartCount})`} isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
              </>
            )}

            {user ? (
              <>
                {!isAdmin() && <NavLink to="/orders" label="My Orders" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-lg text-gray-700 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" label="Login" isActive={isActive} closeMenu={() => setMobileMenuOpen(false)} />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;