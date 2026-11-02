import { FaSearch, FaBars, FaTimes, FaPlus, FaUserShield } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      urlParams.set('searchTerm', searchTerm.trim());
    } else {
      urlParams.delete('searchTerm');
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl !== null) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className='bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-3.5'>
        {/* Brand Logo */}
        <Link to='/' className='flex items-center gap-2 group'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform'>
            <span className='font-black text-xl tracking-wider'>R</span>
          </div>
          <div className='flex flex-col'>
            <h1 className='font-extrabold text-xl sm:text-2xl tracking-tight leading-none'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>Real</span>
              <span className='text-slate-900'>Estate</span>
            </h1>
            <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5'>
              Homes & Living
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Desktop / Tablet) */}
        <form
          onSubmit={handleSubmit}
          className='hidden md:flex bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white px-4 py-2 rounded-full items-center border border-slate-200/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-72 lg:w-96'
        >
          <input
            type='text'
            placeholder='Search homes, cities, zip...'
            className='bg-transparent focus:outline-none w-full text-sm font-medium text-slate-800 placeholder:text-slate-400'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' aria-label='Submit search'>
            <FaSearch className='text-slate-400 hover:text-blue-600 transition-colors text-sm' />
          </button>
        </form>

        {/* Desktop Nav Items */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link
            to='/'
            className={`text-sm font-semibold transition-colors ${
              isActive('/') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Home
          </Link>
          <Link
            to='/search'
            className={`text-sm font-semibold transition-colors ${
              isActive('/search') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Properties
          </Link>
          <Link
            to='/about'
            className={`text-sm font-semibold transition-colors ${
              isActive('/about') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            About
          </Link>

          {currentUser && currentUser.role === 'admin' && (
            <Link
              to='/admin'
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200 ${
                isActive('/admin') ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              <FaUserShield className='text-sm' /> Admin
            </Link>
          )}

          {/* Quick Create Listing CTA */}
          <Link
            to='/create-listing'
            className='flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all'
          >
            <FaPlus className='text-[10px]' /> Post Ad
          </Link>

          {/* Profile / Auth Button */}
          <Link to='/profile'>
            {currentUser ? (
              <div className='flex items-center gap-2 pl-2 border-l border-slate-200'>
                <img
                  className='rounded-full h-9 w-9 object-cover border-2 border-blue-600 shadow-sm hover:scale-105 transition-transform'
                  src={
                    currentUser.avatar ||
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                  }
                  alt='profile'
                />
                <span className='text-xs font-bold text-slate-700 max-w-[90px] truncate hidden lg:inline'>
                  {currentUser.username}
                </span>
              </div>
            ) : (
              <div className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-blue-100 transition-all hover:scale-105'>
                Sign in
              </div>
            )}
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className='flex items-center gap-3 md:hidden'>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-8 w-8 object-cover border border-blue-600'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <span className='text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-full'>
                Sign In
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='text-slate-700 p-2 text-xl hover:text-blue-600 focus:outline-none'
            aria-label='Toggle navigation menu'
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-white border-b border-slate-200 px-4 py-5 shadow-lg animate-fadeIn'>
          <form onSubmit={handleSubmit} className='mb-4 flex items-center bg-slate-100 px-3.5 py-2.5 rounded-2xl'>
            <FaSearch className='text-slate-400 mr-2 text-xs' />
            <input
              type='text'
              placeholder='Search properties...'
              className='bg-transparent text-sm w-full outline-none'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <nav className='flex flex-col gap-3 font-semibold text-slate-700 text-sm'>
            <Link
              to='/'
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-xl transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to='/search'
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-xl transition-colors ${
                isActive('/search') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              🔍 Browse Properties
            </Link>
            <Link
              to='/about'
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-xl transition-colors ${
                isActive('/about') ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              ℹ️ About Us
            </Link>
            <Link
              to='/create-listing'
              onClick={() => setMobileMenuOpen(false)}
              className='p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center gap-2 justify-center'
            >
              <FaPlus /> Post Property Listing
            </Link>
            {currentUser && currentUser.role === 'admin' && (
              <Link
                to='/admin'
                onClick={() => setMobileMenuOpen(false)}
                className='p-2 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center gap-2'
              >
                <FaUserShield /> Admin Dashboard
              </Link>
            )}
            <Link
              to='/profile'
              onClick={() => setMobileMenuOpen(false)}
              className='p-2 rounded-xl hover:bg-slate-50'
            >
              👤 My Profile & Listings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
