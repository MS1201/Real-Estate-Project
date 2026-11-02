import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaVectorSquare } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  if (!listing) return null;

  const defaultImg =
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60';
  const coverImage =
    listing.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls[0]
      : defaultImg;

  const regularPrice = Number(listing.regularPrice) || 0;
  const discountPrice = Number(listing.discountPrice) || 0;
  const finalPrice = listing.offer && discountPrice > 0 ? discountPrice : regularPrice;
  const savings = listing.offer && regularPrice > discountPrice ? regularPrice - discountPrice : 0;

  return (
    <div className='bg-white group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full hover:-translate-y-1'>
      <Link to={`/listing/${listing._id}`} className='flex flex-col h-full'>
        {/* Cover Image Container */}
        <div className='relative overflow-hidden aspect-[16/11] bg-slate-100'>
          <img
            src={coverImage}
            alt={listing.name || 'Property'}
            className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'
            loading='lazy'
          />

          {/* Top Badges */}
          <div className='absolute top-3 left-3 flex flex-wrap gap-2 z-10'>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-md ${
                listing.type === 'rent'
                  ? 'bg-amber-500/95 text-white'
                  : 'bg-blue-600/95 text-white'
              }`}
            >
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {listing.offer && savings > 0 && (
              <span className='px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-600/95 text-white shadow-md backdrop-blur-md'>
                Save ₹{savings.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className='p-5 flex flex-col flex-1 gap-3'>
          {/* Location */}
          <div className='flex items-center gap-1.5 text-slate-400 text-xs font-semibold'>
            <MdLocationOn className='text-rose-500 text-sm flex-shrink-0' />
            <p className='truncate'>{listing.address || 'Location unavailable'}</p>
          </div>

          {/* Title */}
          <h3 className='font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-1'>
            {listing.name}
          </h3>

          {/* Description Snippet */}
          <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
            {listing.description || 'No description provided for this property.'}
          </p>

          {/* Key Specs Pills */}
          <div className='flex items-center gap-2 pt-2 border-t border-slate-100 text-slate-600 text-xs font-bold'>
            <div className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100'>
              <FaBed className='text-blue-600 text-xs' />
              <span>{listing.bedrooms || 1} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
            </div>
            <div className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100'>
              <FaBath className='text-blue-600 text-xs' />
              <span>{listing.bathrooms || 1} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
            </div>
            {listing.area ? (
              <div className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100'>
                <FaVectorSquare className='text-blue-600 text-xs' />
                <span>{listing.area} sqft</span>
              </div>
            ) : null}
          </div>

          {/* Pricing Row */}
          <div className='mt-auto pt-3 flex items-baseline justify-between'>
            <div>
              <div className='flex items-baseline gap-1'>
                <span className='text-xs font-bold text-slate-400'>₹</span>
                <span className='text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors'>
                  {finalPrice.toLocaleString('en-IN')}
                </span>
                {listing.type === 'rent' && (
                  <span className='text-xs font-semibold text-slate-400'>/month</span>
                )}
              </div>
              {listing.offer && regularPrice > discountPrice && (
                <p className='text-xs text-slate-400 line-through font-semibold'>
                  ₹{regularPrice.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <span className='text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform'>
              Details →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
