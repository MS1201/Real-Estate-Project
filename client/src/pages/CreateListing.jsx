import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUpload, FaTrash, FaCheck } from 'react-icons/fa';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 15000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    contactNumber: '',
    area: 850,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 2 * 1024 * 1024) {
          setImageUploadError('Image too large (2MB max per image)');
          setUploading(false);
          return;
        }
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.error('Cloudinary upload error:', err);
          setImageUploadError(`Image upload failed: ${err.message || 'Please try again.'}`);
          setUploading(false);
        });
    } else {
      if (files.length === 0) {
        setImageUploadError('Please select at least one image to upload');
      } else {
        setImageUploadError('You can only upload up to 6 images per listing');
      }
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlf8wfoti';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'mern_estate';
    data.append('upload_preset', uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );

    if (!res.ok) {
      throw new Error('Image upload to cloud failed');
    }

    const uploadData = await res.json();
    return uploadData.secure_url;
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
      return;
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return setError('Geolocation is not supported by your browser');
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          if (data && data.display_name) {
            setFormData({
              ...formData,
              address: data.display_name,
            });
          } else {
            setError('Could not fetch address for your location');
          }
        } catch (err) {
          setError('Error fetching address: ' + err.message);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setError('Geolocation error: ' + err.message);
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.offer && +formData.regularPrice <= +formData.discountPrice) {
        return setError('Discounted price must be lower than the regular price');
      }

      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-4 sm:p-6 max-w-5xl mx-auto my-8'>
      <div className='bg-white p-6 sm:p-12 rounded-[36px] shadow-xl border border-slate-100'>
        <div className='text-center max-w-xl mx-auto mb-10'>
          <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full'>
            Owner Portal
          </span>
          <h1 className='text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-3'>
            Post a <span className='text-blue-600'>New Property</span>
          </h1>
          <p className='text-slate-500 text-sm mt-1'>
            Reach thousands of verified buyers and tenants across India
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-10'>
          {/* Left Form Column */}
          <div className='flex flex-col gap-5 flex-1'>
            {/* Listing Title */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                Property Title *
              </label>
              <input
                type='text'
                placeholder='e.g. Luxury 3BHK Apartment with Sea View'
                className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 font-medium text-sm transition-all'
                id='name'
                maxLength='80'
                minLength='10'
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            {/* Description */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                Detailed Description *
              </label>
              <textarea
                placeholder='Highlight key features, amenities, nearby metro, schools...'
                className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 font-medium text-sm min-h-[110px] transition-all'
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            {/* Address with Geolocation */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                Address & City *
              </label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Full street address, neighborhood, city'
                  className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 flex-1 font-medium text-sm'
                  id='address'
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
                <button
                  type='button'
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className='bg-slate-100 hover:bg-rose-50 border border-slate-200 p-3.5 rounded-2xl text-rose-500 transition-colors shadow-sm'
                  title='Detect Current Location'
                >
                  {locationLoading ? (
                    <div className='w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin'></div>
                  ) : (
                    <FaMapMarkerAlt className='text-lg' />
                  )}
                </button>
              </div>
            </div>

            {/* Contact Number */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                Contact Number (10-digit Mobile) *
              </label>
              <input
                type='text'
                placeholder='9876543210'
                className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 font-medium text-sm'
                id='contactNumber'
                required
                pattern='[0-9]{10}'
                title='Phone number must be exactly 10 digits'
                maxLength='10'
                minLength='10'
                onChange={handleChange}
                value={formData.contactNumber}
              />
            </div>

            {/* Listing Type Toggle */}
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 text-xs uppercase tracking-wider'>
                Listing Purpose *
              </label>
              <div className='grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, type: 'rent' })}
                  className={`py-3 rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                    formData.type === 'rent'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  {formData.type === 'rent' && <FaCheck className='text-[10px]' />} For Rent
                </button>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, type: 'sale' })}
                  className={`py-3 rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                    formData.type === 'sale'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  {formData.type === 'sale' && <FaCheck className='text-[10px]' />} For Sale
                </button>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className='flex flex-wrap gap-3 mt-1'>
              <label className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-4 h-4 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className='font-semibold text-xs text-slate-700'>Parking Available</span>
              </label>
              <label className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-4 h-4 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className='font-semibold text-xs text-slate-700'>Fully Furnished</span>
              </label>
              <label className='flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-4 h-4 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className='font-semibold text-xs text-slate-700'>Special Discount Offer</span>
              </label>
            </div>

            {/* Numeric Specs Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2'>
              <div className='flex flex-col gap-1'>
                <label className='font-bold text-slate-500 text-[11px] uppercase'>Bedrooms</label>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='20'
                  required
                  className='p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-sm text-slate-800'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='font-bold text-slate-500 text-[11px] uppercase'>Bathrooms</label>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='20'
                  required
                  className='p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-sm text-slate-800'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='font-bold text-slate-500 text-[11px] uppercase'>Area (sqft)</label>
                <input
                  type='number'
                  id='area'
                  min='50'
                  required
                  className='p-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-sm text-slate-800'
                  onChange={handleChange}
                  value={formData.area}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='font-bold text-slate-500 text-[11px] uppercase'>
                  Regular Price (₹ {formData.type === 'rent' ? '/ mo' : ''})
                </label>
                <input
                  type='number'
                  id='regularPrice'
                  min='100'
                  required
                  className='p-3 border border-slate-200 rounded-xl bg-slate-50 font-black text-sm text-blue-600'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
              </div>
              {formData.offer && (
                <div className='flex flex-col gap-1'>
                  <label className='font-bold text-slate-500 text-[11px] uppercase'>
                    Discounted Price (₹)
                  </label>
                  <input
                    type='number'
                    id='discountPrice'
                    min='0'
                    required
                    className='p-3 border border-slate-200 rounded-xl bg-slate-50 font-black text-sm text-emerald-600'
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Media Upload */}
          <div className='flex flex-col flex-1 gap-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 self-start w-full'>
            <div>
              <p className='font-bold text-slate-800 text-sm'>Property Photos</p>
              <p className='text-xs text-slate-500 mt-0.5'>
                Cover image will be first (max 6 images, up to 2MB each)
              </p>
            </div>

            <div className='flex gap-2'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-2 w-full bg-white border border-slate-200 rounded-xl text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5'
              >
                <FaUpload className='text-[10px]' /> {uploading ? '...' : 'Upload'}
              </button>
            </div>

            {imageUploadError && (
              <p className='text-rose-600 text-xs font-semibold bg-rose-50 p-3 rounded-xl border border-rose-100'>
                {imageUploadError}
              </p>
            )}

            {/* Uploaded thumbnails */}
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='relative group overflow-hidden rounded-2xl border border-slate-200 bg-white aspect-video'
                  >
                    <img
                      src={url}
                      alt='listing'
                      className='w-full h-full object-cover transition-transform group-hover:scale-105 duration-300'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                      className='absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 shadow-md text-xs'
                      title='Remove photo'
                    >
                      <FaTrash className='text-[10px]' />
                    </button>
                  </div>
                ))}
            </div>

            {/* Submit Action */}
            <button
              disabled={loading || uploading}
              className='p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4'
            >
              {loading ? 'Publishing Property...' : 'Publish Property Listing'}
            </button>
            {error && (
              <p className='text-rose-600 text-xs bg-rose-50 p-3 rounded-xl text-center font-bold border border-rose-100'>
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
