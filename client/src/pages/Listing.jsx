import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaWhatsapp,
  FaPhoneAlt,
  FaVectorSquare,
  FaCreditCard,
  FaTimes,
  FaCheckCircle,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation, Pagination]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);
  const [buySuccess, setBuySuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false || !data._id) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleBuyNow = async () => {
    try {
      setBuying(true);
      setBuyError(null);

      const res = await fetch('/api/wallet/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ propertyId: listing._id }),
      });
      const data = await res.json();

      if (data.success === false) {
        setBuyError(data.message || 'Payment failed');
        setBuying(false);
        return;
      }

      setBuySuccess(true);
      setBuying(false);

      setTimeout(() => {
        setShowPaymentModal(false);
        window.location.reload();
      }, 2500);
    } catch (err) {
      setBuyError(err.message || 'Payment processing error');
      setBuying(false);
    }
  };

  const copyListingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto p-6 py-20 flex flex-col items-center justify-center min-h-[60vh]'>
        <div className='w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
        <p className='mt-4 font-bold text-slate-700 text-lg'>Loading property details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className='max-w-xl mx-auto p-8 my-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100'>
        <div className='w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4'>
          ⚠️
        </div>
        <h2 className='text-2xl font-bold text-slate-800 mb-2'>Property Not Found</h2>
        <p className='text-slate-500 text-sm mb-6'>
          The property you are looking for may have been removed or does not exist.
        </p>
        <Link
          to='/search'
          className='inline-block bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors'
        >
          Browse All Properties
        </Link>
      </div>
    );
  }

  const regularPrice = Number(listing.regularPrice) || 0;
  const discountPrice = Number(listing.discountPrice) || 0;
  const finalPrice = listing.offer && discountPrice > 0 ? discountPrice : regularPrice;
  const savings = listing.offer && regularPrice > discountPrice ? regularPrice - discountPrice : 0;

  return (
    <main className='pb-20'>
      {/* ── IMAGE GALLERY / SWIPER ───────────────────────────────── */}
      <div className='relative max-w-7xl mx-auto mt-6 px-4'>
        {listing.imageUrls && listing.imageUrls.length > 0 ? (
          <Swiper
            navigation
            pagination={{ clickable: true }}
            className='rounded-3xl overflow-hidden shadow-xl aspect-[16/9] max-h-[550px]'
          >
            {listing.imageUrls.map((url, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className='h-full w-full min-h-[380px] sm:min-h-[500px]'
                  style={{
                    background: `url(${url}) center/cover no-repeat`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            className='h-[380px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl'
            style={{
              background: `url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200) center/cover no-repeat`,
            }}
          ></div>
        )}

        {/* Share Button Floating */}
        <button
          onClick={copyListingLink}
          className='absolute top-6 right-8 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-blue-600 hover:scale-110 transition-all'
          title='Share property'
          aria-label='Share property link'
        >
          <FaShare className='text-sm' />
        </button>

        {copied && (
          <div className='absolute top-20 right-8 z-20 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-slate-700 animate-fadeIn'>
            ✓ Link copied to clipboard!
          </div>
        )}
      </div>

      {/* ── LISTING DETAILS ──────────────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-4 mt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-start'>
          {/* Left Column (2 Cols) */}
          <div className='lg:col-span-2 flex flex-col gap-6'>
            {/* Header info */}
            <div>
              <div className='flex flex-wrap items-center gap-2 mb-3'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    listing.type === 'rent'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                </span>
                {listing.offer && savings > 0 && (
                  <span className='px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800'>
                    Save ₹{savings.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
                {listing.name}
              </h1>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  listing.address
                )}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-slate-500 font-medium text-sm sm:text-base hover:text-blue-600 transition-colors mt-2'
              >
                <FaMapMarkerAlt className='text-rose-500' />
                <span>{listing.address}</span>
              </a>
            </div>

            {/* Key Specs Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              <div className='bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 items-center text-center'>
                <FaBed className='text-2xl text-blue-600 mb-1' />
                <span className='text-lg font-black text-slate-800'>{listing.bedrooms}</span>
                <span className='text-xs text-slate-400 font-medium uppercase'>
                  {listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
                </span>
              </div>
              <div className='bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 items-center text-center'>
                <FaBath className='text-2xl text-blue-600 mb-1' />
                <span className='text-lg font-black text-slate-800'>{listing.bathrooms}</span>
                <span className='text-xs text-slate-400 font-medium uppercase'>
                  {listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}
                </span>
              </div>
              <div className='bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 items-center text-center'>
                <FaVectorSquare className='text-2xl text-blue-600 mb-1' />
                <span className='text-lg font-black text-slate-800'>{listing.area || 0}</span>
                <span className='text-xs text-slate-400 font-medium uppercase'>Sq Feet</span>
              </div>
              <div className='bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 items-center text-center'>
                <FaParking className='text-2xl text-blue-600 mb-1' />
                <span className='text-lg font-black text-slate-800'>
                  {listing.parking ? 'Yes' : 'No'}
                </span>
                <span className='text-xs text-slate-400 font-medium uppercase'>Parking</span>
              </div>
            </div>

            {/* Property Description */}
            <div className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3'>
              <h2 className='text-xl font-bold text-slate-800'>About this property</h2>
              <p className='text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line'>
                {listing.description}
              </p>
            </div>

            {/* Amenities details */}
            <div className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm'>
              <h2 className='text-xl font-bold text-slate-800 mb-4'>Property Features</h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm'>
                <div className='flex items-center gap-2 text-slate-700 font-medium'>
                  <FaChair className='text-blue-600' />
                  <span>Furnishing: {listing.furnished ? 'Fully Furnished' : 'Unfurnished'}</span>
                </div>
                <div className='flex items-center gap-2 text-slate-700 font-medium'>
                  <FaParking className='text-blue-600' />
                  <span>Parking: {listing.parking ? 'Designated Spot' : 'Street Parking'}</span>
                </div>
                <div className='flex items-center gap-2 text-slate-700 font-medium'>
                  <FaCheckCircle className='text-emerald-500' />
                  <span>Verified Listing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col Sticky Card) */}
          <div className='lg:sticky lg:top-24 flex flex-col gap-6'>
            <div className='bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-6'>
              {/* Pricing Box */}
              <div>
                <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                  Price Details
                </span>
                <div className='flex items-baseline gap-2 mt-1'>
                  <span className='text-3xl sm:text-4xl font-black text-slate-900'>
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                  {listing.type === 'rent' && (
                    <span className='text-sm font-semibold text-slate-400'>/ month</span>
                  )}
                </div>
                {listing.offer && regularPrice > discountPrice && (
                  <p className='text-sm text-slate-400 line-through font-semibold mt-0.5'>
                    Original: ₹{regularPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-3'>
                {/* Contact agent options */}
                {listing.contactNumber && (
                  <div className='flex flex-col gap-2'>
                    <a
                      href={`tel:${listing.contactNumber}`}
                      className='flex items-center justify-center gap-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all'
                    >
                      <FaPhoneAlt className='text-xs' /> Call Owner: {listing.contactNumber}
                    </a>
                    <a
                      href={`https://wa.me/91${listing.contactNumber}?text=${encodeURIComponent(
                        `Hello, I saw your property "${listing.name}" on RealEstate and would like more information.`
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md shadow-emerald-200 transition-all hover:scale-[1.02]'
                    >
                      <FaWhatsapp className='text-base' /> Chat on WhatsApp
                    </a>
                  </div>
                )}

                {/* Instant Book / Pay */}
                {currentUser && listing.userRef !== currentUser._id && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={buying || buySuccess}
                    className='flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] disabled:opacity-50'
                  >
                    <FaCreditCard />
                    {buying
                      ? 'Processing...'
                      : buySuccess
                      ? 'Payment Complete'
                      : `Instant ${listing.type === 'rent' ? 'Rent' : 'Buy'} Now`}
                  </button>
                )}

                {/* If not logged in, prompt sign in to book */}
                {!currentUser && (
                  <Link
                    to='/sign-in'
                    className='text-center bg-blue-50 text-blue-700 hover:bg-blue-100 py-3.5 px-4 rounded-2xl font-bold text-sm transition-colors'
                  >
                    Sign in to Book or Message Landlord
                  </Link>
                )}
              </div>

              {/* Inquire Form Toggle */}
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className='text-xs font-bold text-blue-600 hover:underline text-center uppercase tracking-wider'
                >
                  Send Direct Inquiry Message ↓
                </button>
              )}

              {contact && <Contact listing={listing} />}
            </div>
          </div>
        </div>
      </div>

      {/* ── PAYMENT MODAL ────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-slate-100 relative animate-fadeIn'>
            <button
              onClick={() => setShowPaymentModal(false)}
              className='absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xl'
            >
              <FaTimes />
            </button>

            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg'>
                💳
              </div>
              <div>
                <h3 className='font-bold text-lg text-slate-900'>Secure Checkout</h3>
                <p className='text-xs text-slate-400'>Direct Bank & UPI Payment Portal</p>
              </div>
            </div>

            <div className='bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6'>
              <p className='text-xs text-slate-500 font-medium'>Amount to Pay</p>
              <p className='text-3xl font-black text-slate-900 mt-1'>
                ₹{finalPrice.toLocaleString('en-IN')}
              </p>
              <p className='text-[11px] text-slate-400 mt-1 truncate'>
                Property: {listing.name}
              </p>
            </div>

            <p className='text-xs font-bold text-slate-700 uppercase tracking-wider mb-3'>
              Choose Payment Method
            </p>

            <div className='flex flex-col gap-3 mb-6'>
              {/* UPI Option */}
              <button
                onClick={handleBuyNow}
                disabled={buying || buySuccess}
                className='flex items-center gap-3.5 p-3.5 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left disabled:opacity-50'
              >
                <div className='w-12 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-blue-700 shadow-sm'>
                  UPI
                </div>
                <div>
                  <p className='font-bold text-slate-800 text-sm'>Pay via UPI / PhonePe / GPay</p>
                  <p className='text-xs text-slate-400'>Fast 1-click simulation</p>
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={handleBuyNow}
                disabled={buying || buySuccess}
                className='flex items-center gap-3.5 p-3.5 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left disabled:opacity-50'
              >
                <div className='w-12 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-[10px] shadow-sm'>
                  CARD
                </div>
                <div>
                  <p className='font-bold text-slate-800 text-sm'>Credit / Debit Card</p>
                  <p className='text-xs text-slate-400'>Visa, Mastercard, RuPay</p>
                </div>
              </button>
            </div>

            {buying && (
              <p className='text-center text-blue-600 animate-pulse font-bold text-xs py-2'>
                Processing payment securely...
              </p>
            )}
            {buySuccess && (
              <p className='text-center text-emerald-600 font-bold text-xs py-2 flex items-center justify-center gap-1.5'>
                <FaCheckCircle /> Payment verified! Refreshing...
              </p>
            )}
            {buyError && (
              <p className='text-center text-rose-600 font-semibold text-xs py-2 bg-rose-50 rounded-xl'>
                {buyError}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
