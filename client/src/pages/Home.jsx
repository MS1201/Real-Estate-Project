import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import {
  FaSearch,
  FaShieldAlt,
  FaAward,
  FaHandshake,
  FaArrowRight,
  FaHome,
  FaBuilding,
  FaCity,
  FaStar,
} from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  SwiperCore.use([Navigation, Autoplay, Pagination]);

  useEffect(() => {
    const fetchAllHomeListings = async () => {
      try {
        setLoading(true);
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4'),
        ]);

        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json(),
        ]);

        if (Array.isArray(offerData)) setOfferListings(offerData);
        if (Array.isArray(rentData)) setRentListings(rentData);
        if (Array.isArray(saleData)) setSaleListings(saleData);
      } catch (error) {
        console.error('Error fetching home listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHomeListings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchTerm.trim()) urlParams.set('searchTerm', searchTerm.trim());
    if (searchType !== 'all') urlParams.set('type', searchType);
    navigate(`/search?${urlParams.toString()}`);
  };

  // Combine featured listings for banner
  const featuredSlides = [
    ...offerListings,
    ...saleListings,
    ...rentListings,
  ].filter((item, index, self) => index === self.findIndex((t) => t._id === item._id)).slice(0, 5);

  return (
    <div className='pb-16'>
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <div className='relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-16 pb-28 px-4'>
        {/* Glow ambient background orbs */}
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none'></div>

        <div className='max-w-6xl mx-auto flex flex-col items-center text-center relative z-10 gap-6'>
          {/* Top Pill Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/70 text-blue-700 text-xs sm:text-sm font-bold shadow-sm border border-blue-200/50'>
            <span className='flex h-2 w-2 rounded-full bg-blue-600 animate-ping'></span>
            ✨ India's Premier Real Estate & Modern Homes Marketplace
          </div>

          {/* Headline */}
          <h1 className='text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.15]'>
            Discover Your Next Space with{' '}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'>
              Confidence & Elegance
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-slate-600 text-base sm:text-xl max-w-2xl font-normal leading-relaxed'>
            Explore handpicked apartments, luxury penthouses, and peaceful family homes with verified landlords, transparent pricing, and zero hassle.
          </p>

          {/* Modern Floating Search Bar */}
          <div className='w-full max-w-3xl mt-4 bg-white p-2.5 sm:p-3 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200 flex flex-col md:flex-row gap-2'>
            {/* Buy / Rent Switch */}
            <div className='flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl'>
              <button
                type='button'
                onClick={() => setSearchType('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  searchType === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type='button'
                onClick={() => setSearchType('sale')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  searchType === 'sale'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buy
              </button>
              <button
                type='button'
                onClick={() => setSearchType('rent')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  searchType === 'rent'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rent
              </button>
            </div>

            {/* Keyword Input Form */}
            <form onSubmit={handleSearchSubmit} className='flex-1 flex items-center px-3'>
              <FaSearch className='text-slate-400 mr-2 flex-shrink-0' />
              <input
                type='text'
                placeholder='Search city, neighborhood, or landmark...'
                className='w-full bg-transparent focus:outline-none text-slate-800 text-sm sm:text-base font-medium placeholder:text-slate-400'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* Search Submit Button */}
            <button
              onClick={handleSearchSubmit}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]'
            >
              Search
            </button>
          </div>

          {/* Quick Metrics / Social Proof */}
          <div className='grid grid-cols-3 gap-6 sm:gap-12 mt-6 pt-6 border-t border-slate-200/60 max-w-2xl w-full'>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-slate-900'>5,000+</p>
              <p className='text-xs sm:text-sm text-slate-500 font-medium'>Verified Properties</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-slate-900'>98.6%</p>
              <p className='text-xs sm:text-sm text-slate-500 font-medium'>Customer Satisfaction</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl font-extrabold text-slate-900'>50+</p>
              <p className='text-xs sm:text-sm text-slate-500 font-medium'>Prime Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED PROPERTIES SLIDER ──────────────────────────── */}
      {featuredSlides.length > 0 && (
        <div className='max-w-7xl mx-auto px-4 -mt-12 relative z-20'>
          <Swiper
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className='rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white'
          >
            {featuredSlides.map((listing) => (
              <SwiperSlide key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <div
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%), url(${
                        listing.imageUrls?.[0] ||
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'
                      }) center/cover no-repeat`,
                    }}
                    className='h-[380px] sm:h-[500px] flex flex-col justify-end p-6 sm:p-12 text-white group cursor-pointer'
                  >
                    <div className='max-w-2xl'>
                      <span className='inline-block bg-blue-600 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-md'>
                        Featured {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                      <h2 className='text-2xl sm:text-4xl font-extrabold group-hover:text-blue-300 transition-colors line-clamp-1'>
                        {listing.name}
                      </h2>
                      <p className='text-sm sm:text-base text-slate-200 mt-1 flex items-center gap-2'>
                        📍 {listing.address}
                      </p>
                      <p className='text-xl sm:text-3xl font-black mt-2 text-emerald-400'>
                        ₹{((listing.offer ? listing.discountPrice : listing.regularPrice) || 0).toLocaleString('en-IN')}
                        {listing.type === 'rent' && <span className='text-sm font-medium text-white'> / month</span>}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* ── CATEGORIES SECTION ─────────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-4 mt-20'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-extrabold text-slate-800'>Popular Categories</h2>
          <p className='text-slate-500 mt-2 font-medium'>Find your preferred property type in seconds</p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
          {[
            { label: 'Modern Apartments', icon: <FaBuilding className='text-blue-600 text-3xl' />, query: 'apartment' },
            { label: 'Luxury Villas', icon: <FaHome className='text-indigo-600 text-3xl' />, query: 'villa' },
            { label: 'Budget Rentals', icon: <FaCity className='text-emerald-600 text-3xl' />, query: 'rent' },
            { label: 'Discount Deals', icon: <FaStar className='text-amber-500 text-3xl' />, query: 'offer' },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (cat.query === 'rent') navigate('/search?type=rent');
                else if (cat.query === 'offer') navigate('/search?offer=true');
                else navigate(`/search?searchTerm=${cat.query}`);
              }}
              className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center gap-3 group'
            >
              <div className='p-4 bg-slate-50 group-hover:bg-blue-50 rounded-2xl transition-colors'>
                {cat.icon}
              </div>
              <h3 className='font-bold text-slate-800 text-sm sm:text-base group-hover:text-blue-600 transition-colors'>
                {cat.label}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* ── LISTINGS SECTIONS ──────────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-4 flex flex-col gap-16 mt-20'>
        {/* Special Offers Section */}
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-8 border-b pb-4'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>
                  Exclusive Opportunities
                </span>
                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mt-2'>Special Price Offers</h2>
                <p className='text-slate-500 text-sm mt-1'>Properties with verified discounts and top rates</p>
              </div>
              <Link
                to='/search?offer=true'
                className='inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-all'
              >
                View all <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Rental Properties Section */}
        {rentListings && rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-8 border-b pb-4'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full'>
                  Ready to Move In
                </span>
                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mt-2'>Properties For Rent</h2>
                <p className='text-slate-500 text-sm mt-1'>Furnished & semi-furnished rentals across top localities</p>
              </div>
              <Link
                to='/search?type=rent'
                className='inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-all'
              >
                View all <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Properties for Sale Section */}
        {saleListings && saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-8 border-b pb-4'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full'>
                  Prime Investment
                </span>
                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mt-2'>Properties For Sale</h2>
                <p className='text-slate-500 text-sm mt-1'>Buy your forever home or prime real estate assets</p>
              </div>
              <Link
                to='/search?type=sale'
                className='inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-all'
              >
                View all <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── WHY CHOOSE US SECTION ──────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-4 mt-28'>
        <div className='bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-14 rounded-[36px] shadow-2xl relative overflow-hidden'>
          <div className='absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none'></div>

          <div className='max-w-2xl mb-12'>
            <span className='text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/40 border border-blue-700/50 px-3.5 py-1.5 rounded-full'>
              Why Choose RealEstate
            </span>
            <h2 className='text-3xl sm:text-4xl font-extrabold mt-4 tracking-tight'>
              Engineered for Modern Property Hunters
            </h2>
            <p className='text-slate-300 mt-3 text-sm sm:text-base leading-relaxed'>
              We eliminate hidden charges, unnecessary agents, and fraudulent listings so you find peace of mind.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm'>
              <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 text-2xl mb-4'>
                <FaShieldAlt />
              </div>
              <h3 className='text-lg font-bold mb-2'>100% Verified Listings</h3>
              <p className='text-slate-300 text-xs sm:text-sm leading-relaxed'>
                Every listing undergoes automated spam detection and authenticity checks before going live.
              </p>
            </div>

            <div className='bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm'>
              <div className='w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-2xl mb-4'>
                <FaHandshake />
              </div>
              <h3 className='text-lg font-bold mb-2'>Direct Owner Contact</h3>
              <p className='text-slate-300 text-xs sm:text-sm leading-relaxed'>
                Connect immediately via direct phone call, WhatsApp, or email without high broker commission fees.
              </p>
            </div>

            <div className='bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm'>
              <div className='w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 text-2xl mb-4'>
                <FaAward />
              </div>
              <h3 className='text-lg font-bold mb-2'>Transparent Transactions</h3>
              <p className='text-slate-300 text-xs sm:text-sm leading-relaxed'>
                Seamless digital payments, UPI integration, and automated receipts for both buyers and landlords.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CALL TO ACTION BANNER ──────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-4 mt-20 text-center'>
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] p-8 sm:p-12 text-white shadow-xl shadow-blue-200 flex flex-col items-center gap-5'>
          <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight'>
            Are You a Property Owner?
          </h2>
          <p className='text-blue-100 max-w-xl text-sm sm:text-base leading-relaxed'>
            List your apartment, house, or commercial unit today and get connected with verified prospective buyers and tenants across India.
          </p>
          <div className='flex flex-wrap gap-4 justify-center mt-2'>
            <Link
              to='/create-listing'
              className='bg-white text-blue-600 hover:bg-slate-50 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-105'
            >
              Post Free Listing
            </Link>
            <Link
              to='/search'
              className='bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/30 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all'
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
