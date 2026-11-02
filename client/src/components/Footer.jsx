import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        {/* Main 4-column layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800'>
          {/* Brand info */}
          <div className='flex flex-col gap-4'>
            <Link to='/' className='flex items-center gap-2'>
              <div className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md'>
                <span className='font-black text-xl'>R</span>
              </div>
              <h2 className='font-extrabold text-2xl tracking-tight text-white'>
                Real<span className='text-blue-500'>Estate</span>
              </h2>
            </Link>
            <p className='text-slate-400 text-sm leading-relaxed'>
              India's premier real estate portal connecting buyers, sellers, and tenants with verified modern living spaces.
            </p>
            <div className='flex gap-3 mt-2'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-all'
                aria-label='Facebook'
              >
                <FaFacebookF className='text-xs' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-slate-300 hover:text-white transition-all'
                aria-label='Twitter'
              >
                <FaTwitter className='text-xs' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-300 hover:text-white transition-all'
                aria-label='Instagram'
              >
                <FaInstagram className='text-xs' />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-700 flex items-center justify-center text-slate-300 hover:text-white transition-all'
                aria-label='LinkedIn'
              >
                <FaLinkedinIn className='text-xs' />
              </a>
              <a
                href='https://github.com'
                target='_blank'
                rel='noreferrer'
                className='w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all'
                aria-label='GitHub'
              >
                <FaGithub className='text-xs' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-3'>
            <h3 className='text-white font-bold text-base mb-1 tracking-wider uppercase text-xs'>
              Quick Navigation
            </h3>
            <Link to='/' className='hover:text-blue-400 text-sm transition-colors'>
              Home
            </Link>
            <Link to='/search' className='hover:text-blue-400 text-sm transition-colors'>
              Browse Properties
            </Link>
            <Link to='/about' className='hover:text-blue-400 text-sm transition-colors'>
              About Us
            </Link>
            <Link to='/create-listing' className='hover:text-blue-400 text-sm transition-colors'>
              List Your Property
            </Link>
            <Link to='/profile' className='hover:text-blue-400 text-sm transition-colors'>
              My Account
            </Link>
          </div>

          {/* Popular Categories */}
          <div className='flex flex-col gap-3'>
            <h3 className='text-white font-bold text-base mb-1 tracking-wider uppercase text-xs'>
              Property Types
            </h3>
            <Link to='/search?type=rent' className='hover:text-blue-400 text-sm transition-colors'>
              Rental Apartments
            </Link>
            <Link to='/search?type=sale' className='hover:text-blue-400 text-sm transition-colors'>
              Homes for Sale
            </Link>
            <Link to='/search?offer=true' className='hover:text-blue-400 text-sm transition-colors'>
              Discounted Offers
            </Link>
            <Link to='/search?furnished=true' className='hover:text-blue-400 text-sm transition-colors'>
              Furnished Residences
            </Link>
            <Link to='/search?parking=true' className='hover:text-blue-400 text-sm transition-colors'>
              Properties with Parking
            </Link>
          </div>

          {/* Contact Details */}
          <div className='flex flex-col gap-3'>
            <h3 className='text-white font-bold text-base mb-1 tracking-wider uppercase text-xs'>
              Contact & Support
            </h3>
            <p className='flex items-center gap-3 text-sm text-slate-400'>
              <FaMapMarkerAlt className='text-rose-500 flex-shrink-0' />
              Bandra Kurla Complex, Mumbai, India
            </p>
            <p className='flex items-center gap-3 text-sm text-slate-400'>
              <FaPhoneAlt className='text-emerald-500 flex-shrink-0' />
              +91 (022) 8000-ESTATE
            </p>
            <p className='flex items-center gap-3 text-sm text-slate-400'>
              <FaEnvelope className='text-blue-400 flex-shrink-0' />
              support@realestate.in
            </p>
            <div className='mt-2 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60'>
              <p className='text-xs text-slate-400'>
                💡 Need property advice? Click the <span className='text-blue-400 font-bold'>AI Chat Assistant</span> at the bottom right anytime!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className='pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500'>
          <p>&copy; {new Date().getFullYear()} RealEstate Inc. All rights reserved.</p>
          <div className='flex gap-6'>
            <span className='hover:text-slate-400 cursor-pointer'>Privacy Policy</span>
            <span className='hover:text-slate-400 cursor-pointer'>Terms of Service</span>
            <span className='hover:text-slate-400 cursor-pointer'>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
