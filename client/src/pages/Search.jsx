import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { FaSearch, FaFilter, FaRedo, FaSlidersH } from 'react-icons/fa';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
    minPrice: 0,
    maxPrice: 100000000,
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const minPriceFromUrl = urlParams.get('minPrice');
    const maxPriceFromUrl = urlParams.get('maxPrice');

    if (
      searchTermFromUrl !== null ||
      typeFromUrl !== null ||
      parkingFromUrl !== null ||
      furnishedFromUrl !== null ||
      offerFromUrl !== null ||
      sortFromUrl !== null ||
      orderFromUrl !== null ||
      minPriceFromUrl !== null ||
      maxPriceFromUrl !== null
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
        minPrice: minPriceFromUrl ? parseFloat(minPriceFromUrl) : 0,
        maxPrice: maxPriceFromUrl ? parseFloat(maxPriceFromUrl) : 100000000,
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          if (data.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
          setListings(data);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }

    if (e.target.id === 'minPrice' || e.target.id === 'maxPrice') {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    if (sidebardata.minPrice > 0) urlParams.set('minPrice', sidebardata.minPrice);
    if (sidebardata.maxPrice < 100000000) urlParams.set('maxPrice', sidebardata.maxPrice);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleReset = () => {
    setSidebardata({
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'createdAt',
      order: 'desc',
      minPrice: 0,
      maxPrice: 100000000,
    });
    navigate('/search');
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      if (data.length < 9) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Page Title & Breadcrumb */}
      <div className='mb-8'>
        <h1 className='text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight'>
          Explore <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>Properties</span>
        </h1>
        <p className='text-slate-500 mt-1 font-medium'>
          Filter through modern apartments, luxury villas, and prime rentals
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Left Filter Sidebar */}
        <div className='lg:w-80 flex-shrink-0'>
          <div className='bg-white p-6 rounded-3xl shadow-lg shadow-slate-100 border border-slate-200/80 sticky top-24'>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100'>
              <h2 className='text-lg font-bold text-slate-800 flex items-center gap-2'>
                <FaFilter className='text-blue-600 text-sm' /> Filters
              </h2>
              <button
                type='button'
                onClick={handleReset}
                className='text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors'
              >
                <FaRedo className='text-[10px]' /> Reset
              </button>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-5 mt-5'>
              {/* Keyword Search */}
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                  Location / Keyword
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    id='searchTerm'
                    placeholder='City, locality, project...'
                    className='w-full border border-slate-200 p-3 pr-9 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                  <FaSearch className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs' />
                </div>
              </div>

              {/* Property Type Radio Group */}
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                  Listing Type
                </label>
                <div className='grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl'>
                  {['all', 'sale', 'rent'].map((typeOption) => (
                    <button
                      key={typeOption}
                      type='button'
                      onClick={() => setSidebardata({ ...sidebardata, type: typeOption })}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        sidebardata.type === typeOption
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {typeOption === 'all' ? 'All' : typeOption === 'sale' ? 'Buy' : 'Rent'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities / Features */}
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                  Amenities & Deals
                </label>
                <div className='flex flex-col gap-2'>
                  <label className='flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer'>
                    <input
                      type='checkbox'
                      id='offer'
                      className='w-4 h-4 rounded text-blue-600 focus:ring-blue-400'
                      onChange={handleChange}
                      checked={sidebardata.offer}
                    />
                    <span className='text-xs font-semibold text-slate-700'>Special Offers & Discounts</span>
                  </label>
                  <label className='flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer'>
                    <input
                      type='checkbox'
                      id='parking'
                      className='w-4 h-4 rounded text-blue-600 focus:ring-blue-400'
                      onChange={handleChange}
                      checked={sidebardata.parking}
                    />
                    <span className='text-xs font-semibold text-slate-700'>Dedicated Parking</span>
                  </label>
                  <label className='flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer'>
                    <input
                      type='checkbox'
                      id='furnished'
                      className='w-4 h-4 rounded text-blue-600 focus:ring-blue-400'
                      onChange={handleChange}
                      checked={sidebardata.furnished}
                    />
                    <span className='text-xs font-semibold text-slate-700'>Fully Furnished</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                  Price Range (₹)
                </label>
                <div className='flex gap-2 items-center'>
                  <input
                    type='number'
                    id='minPrice'
                    className='border border-slate-200 rounded-xl p-2.5 w-full text-xs bg-slate-50 font-semibold focus:border-blue-500 outline-none'
                    placeholder='Min (₹)'
                    value={sidebardata.minPrice || ''}
                    onChange={handleChange}
                  />
                  <span className='text-slate-400 text-xs font-bold'>-</span>
                  <input
                    type='number'
                    id='maxPrice'
                    className='border border-slate-200 rounded-xl p-2.5 w-full text-xs bg-slate-50 font-semibold focus:border-blue-500 outline-none'
                    placeholder='Max (₹)'
                    value={sidebardata.maxPrice === 100000000 ? '' : sidebardata.maxPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                  Sort By
                </label>
                <select
                  onChange={handleChange}
                  value={`${sidebardata.sort}_${sidebardata.order}`}
                  id='sort_order'
                  className='border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500'
                >
                  <option value='createdAt_desc'>Newest Listed First</option>
                  <option value='createdAt_asc'>Oldest Listed First</option>
                  <option value='regularPrice_asc'>Price: Low to High</option>
                  <option value='regularPrice_desc'>Price: High to Low</option>
                </select>
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2'
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Right Listing Grid */}
        <div className='flex-1'>
          <div className='flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm mb-6'>
            <div className='flex items-center gap-2'>
              <FaSlidersH className='text-blue-600' />
              <span className='font-bold text-slate-800 text-sm'>
                {loading ? 'Searching...' : `${listings.length} Properties Found`}
              </span>
            </div>
            {sidebardata.searchTerm && (
              <span className='text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full'>
                Keyword: "{sidebardata.searchTerm}"
              </span>
            )}
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className='bg-white rounded-3xl p-4 shadow-sm border border-slate-100 animate-pulse flex flex-col gap-4'>
                  <div className='h-48 bg-slate-200 rounded-2xl'></div>
                  <div className='h-4 bg-slate-200 rounded w-3/4'></div>
                  <div className='h-3 bg-slate-100 rounded w-1/2'></div>
                  <div className='h-6 bg-slate-200 rounded w-1/3 mt-2'></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div className='bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center my-6'>
              <div className='w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4'>
                🏠
              </div>
              <h3 className='text-2xl font-bold text-slate-800 mb-2'>No Properties Found</h3>
              <p className='text-slate-500 max-w-md text-sm mb-6'>
                We couldn't find any listings matching your current filter criteria. Try adjusting your keyword or clearing filters.
              </p>
              <button
                onClick={handleReset}
                className='px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md'
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Listing Grid */}
          {!loading && listings.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Show More */}
          {showMore && (
            <div className='text-center mt-10'>
              <button
                onClick={onShowMoreClick}
                className='bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm'
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
