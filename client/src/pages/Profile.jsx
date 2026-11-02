import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import {
  FaCamera,
  FaPlus,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
  FaWallet,
  FaUserShield,
} from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (fileToUpload) => {
    if (fileToUpload.size > 2 * 1024 * 1024) {
      setFileUploadError('Profile photo must be less than 2MB');
      return;
    }
    setFileUploadError(null);
    setFilePerc(20);

    const data = new FormData();
    data.append('file', fileToUpload);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'mern_estate');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await res.json();
      setFilePerc(100);
      setFormData((prev) => ({ ...prev, avatar: uploadData.secure_url }));
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setFileUploadError('Image upload failed. Please try again.');
      setFilePerc(0);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setLoadingListings(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        setLoadingListings(false);
        return;
      }

      setUserListings(Array.isArray(data) ? data : []);
      setLoadingListings(false);
    } catch (err) {
      console.error(err);
      setShowListingsError(true);
      setLoadingListings(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className='p-4 sm:p-6 max-w-2xl mx-auto py-10'>
      <div className='bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100'>
        {/* Header Badges */}
        <div className='flex items-center justify-between pb-6 border-b border-slate-100'>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-800 tracking-tight'>
            Account <span className='text-blue-600'>Profile</span>
          </h1>
          <div className='flex items-center gap-2'>
            {currentUser?.role === 'admin' ? (
              <span className='flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider'>
                <FaUserShield /> Admin
              </span>
            ) : (
              <span className='bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider'>
                Member
              </span>
            )}
            <span className='flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold'>
              <FaWallet className='text-xs' /> ₹{(currentUser?.walletBalance || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-6'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />

          {/* Avatar Upload Bubble */}
          <div className='relative self-center group my-2'>
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer border-4 border-slate-100 shadow-md group-hover:opacity-85 transition-all'
            />
            <button
              type='button'
              onClick={() => fileRef.current.click()}
              className='absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full border-2 border-white shadow-md transition-colors'
              title='Change avatar photo'
            >
              <FaCamera className='text-xs' />
            </button>
          </div>

          {/* Upload Progress/Errors */}
          {fileUploadError && (
            <p className='text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl text-center font-semibold'>
              {fileUploadError}
            </p>
          )}
          {filePerc > 0 && filePerc < 100 && (
            <p className='text-xs text-blue-600 text-center font-bold animate-pulse'>
              Uploading image... {filePerc}%
            </p>
          )}
          {filePerc === 100 && !fileUploadError && (
            <p className='text-xs text-emerald-600 text-center font-bold'>
              ✓ Photo uploaded successfully! Click Update Profile to save.
            </p>
          )}

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
              Username
            </label>
            <input
              type='text'
              placeholder='Username'
              defaultValue={currentUser.username}
              id='username'
              className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='Email'
              id='email'
              defaultValue={currentUser.email}
              className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-bold text-slate-600 uppercase tracking-wider'>
              New Password (leave blank to keep current)
            </label>
            <input
              type='password'
              placeholder='••••••••'
              onChange={handleChange}
              id='password'
              className='border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
            />
          </div>

          <button
            disabled={loading}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-4 font-bold uppercase text-xs tracking-wider shadow-md shadow-blue-100 transition-all disabled:opacity-50 mt-2'
          >
            {loading ? 'Saving...' : 'Update Profile Information'}
          </button>

          {/* Create Listing Shortcut */}
          <Link
            className='flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-4 rounded-2xl font-bold uppercase text-xs tracking-wider text-center shadow-md shadow-emerald-100 transition-all'
            to={'/create-listing'}
          >
            <FaPlus /> Post a New Property Listing
          </Link>
        </form>

        {/* Account Controls */}
        <div className='flex justify-between items-center mt-6 pt-6 border-t border-slate-100 text-xs font-bold'>
          <button
            onClick={handleDeleteUser}
            className='text-rose-500 hover:text-rose-700 transition-colors'
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className='text-amber-600 hover:text-amber-700 transition-colors'
          >
            Sign Out
          </button>
        </div>

        {error && (
          <p className='text-rose-600 text-xs mt-4 text-center font-bold bg-rose-50 p-3 rounded-xl border border-rose-100'>
            {error}
          </p>
        )}
        {updateSuccess && (
          <p className='text-emerald-600 text-xs mt-4 text-center font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100'>
            ✓ Profile has been updated successfully!
          </p>
        )}

        {/* Manage User Listings */}
        <div className='mt-8 pt-6 border-t border-slate-100'>
          <button
            onClick={handleShowListings}
            disabled={loadingListings}
            className='w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50'
          >
            {loadingListings ? 'Loading Your Listings...' : 'Show / Manage My Listings'}
          </button>

          {showListingsError && (
            <p className='text-rose-600 text-xs mt-3 text-center font-bold'>
              Error retrieving your listings.
            </p>
          )}

          {userListings && userListings.length > 0 && (
            <div className='flex flex-col gap-3 mt-6'>
              <h2 className='text-lg font-bold text-slate-800 mb-1'>
                Your Property Listings ({userListings.length})
              </h2>

              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='border border-slate-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all'
                >
                  <Link to={`/listing/${listing._id}`} className='flex items-center gap-3 truncate'>
                    <img
                      src={
                        listing.imageUrls?.[0] ||
                        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'
                      }
                      alt={listing.name}
                      className='h-14 w-14 object-cover rounded-xl shadow-sm flex-shrink-0'
                    />
                    <div className='truncate'>
                      <p className='text-slate-800 font-bold text-sm truncate hover:text-blue-600'>
                        {listing.name}
                      </p>
                      <p className='text-xs text-blue-600 font-bold mt-0.5'>
                        ₹{Number(listing.regularPrice || 0).toLocaleString('en-IN')}
                        {listing.type === 'rent' && <span className='text-slate-400'>/mo</span>}
                      </p>
                    </div>
                  </Link>

                  <div className='flex items-center gap-1.5 flex-shrink-0'>
                    <Link
                      to={`/listing/${listing._id}`}
                      className='p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title='View Live'
                    >
                      <FaExternalLinkAlt className='text-xs' />
                    </Link>
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className='p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors'
                      title='Edit Listing'
                    >
                      <FaEdit className='text-sm' />
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors'
                      title='Delete Listing'
                    >
                      <FaTrash className='text-xs' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
