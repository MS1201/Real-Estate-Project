import { useEffect, useState } from 'react';
import {
  FaUserShield,
  FaHome,
  FaUsers,
  FaCheckCircle,
  FaTrashAlt,
  FaRobot,
  FaExternalLinkAlt,
  FaClock,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingListings();
    fetchAllListings();
    fetchUsers();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const res = await fetch('/api/admin/listings/pending', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setPendingListings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllListings = async () => {
    try {
      const res = await fetch('/api/admin/listings/all', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setAllListings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/listings/approve/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        setPendingListings((prev) => prev.filter((l) => l._id !== id));
        setMessage('Listing approved successfully! It is now live on the site.');
        fetchAllListings();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setPendingListings((prev) => prev.filter((l) => l._id !== id));
        setAllListings((prev) => prev.filter((l) => l._id !== id));
        setMessage('Listing deleted successfully.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and their data?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setMessage('User removed successfully.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutoClean = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/listings/auto-clean', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(typeof data === 'string' ? data : 'Auto-clean completed.');
        fetchPendingListings();
        fetchAllListings();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-4 sm:p-6 my-6'>
      {/* Top Banner */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2.5'>
            <FaUserShield className='text-purple-600' /> Admin Control Center
          </h1>
          <p className='text-slate-500 text-xs sm:text-sm mt-1'>
            Manage property verification, spam cleanup, and registered users
          </p>
        </div>

        <button
          onClick={handleAutoClean}
          disabled={loading}
          className='flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-200 transition-all disabled:opacity-50'
        >
          <FaRobot className='text-sm' /> {loading ? 'Scanning & Cleaning...' : 'Run Auto-Clean Bot'}
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <div
          onClick={() => setActiveTab('pending')}
          className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all'
        >
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Pending Review</p>
            <p className='text-2xl font-black text-amber-500 mt-1'>{pendingListings.length}</p>
          </div>
          <div className='w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl'>
            <FaClock />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all'
        >
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Properties</p>
            <p className='text-2xl font-black text-blue-600 mt-1'>{allListings.length}</p>
          </div>
          <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl'>
            <FaHome />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('users')}
          className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all'
        >
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Registered Users</p>
            <p className='text-2xl font-black text-purple-600 mt-1'>{users.length}</p>
          </div>
          <div className='w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl'>
            <FaUsers />
          </div>
        </div>
      </div>

      {message && (
        <div className='bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm p-4 mb-6 rounded-2xl shadow-sm flex justify-between items-center font-bold'>
          <span>✓ {message}</span>
          <button onClick={() => setMessage('')} className='text-emerald-700 font-bold ml-4 text-base'>
            &times;
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className='flex gap-2 border-b border-slate-200 mb-6'>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          <FaCheckCircle /> Pending Review ({pendingListings.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          <FaHome /> All Properties ({allListings.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          <FaUsers /> Users ({users.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
        {activeTab === 'pending' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider'>
                <tr>
                  <th className='p-4'>Property</th>
                  <th className='p-4'>Price</th>
                  <th className='p-4'>Date Created</th>
                  <th className='p-4 text-right'>Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingListings.length === 0 ? (
                  <tr>
                    <td colSpan='4' className='p-12 text-center text-slate-400 font-medium'>
                      🎉 No pending listings for review! All properties are approved.
                    </td>
                  </tr>
                ) : (
                  pendingListings.map((listing) => (
                    <tr
                      key={listing._id}
                      className='border-b border-slate-50 hover:bg-slate-50/60 transition-colors'
                    >
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={
                              listing.imageUrls?.[0] ||
                              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150'
                            }
                            alt=''
                            className='w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0'
                          />
                          <div className='flex flex-col truncate max-w-xs'>
                            <span className='font-bold text-slate-800 truncate'>{listing.name}</span>
                            <span className='text-xs text-slate-400 truncate'>{listing.address}</span>
                            {listing.flagged && (
                              <span className='text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-black w-fit mt-1'>
                                ⚠️ FLAGGED AS SUSPICIOUS
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='p-4 font-bold text-blue-600'>
                        ₹{Number(listing.regularPrice || 0).toLocaleString('en-IN')}
                      </td>
                      <td className='p-4 text-slate-500 text-xs'>
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className='p-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            to={`/listing/${listing._id}`}
                            className='p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors'
                            title='Inspect'
                          >
                            <FaExternalLinkAlt className='text-xs' />
                          </Link>
                          <button
                            onClick={() => handleApprove(listing._id)}
                            className='bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5'
                            title='Approve Listing'
                          >
                            <FaCheckCircle className='text-xs' /> Approve
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className='bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 p-2.5 rounded-xl text-xs font-bold transition-all'
                            title='Delete Listing'
                          >
                            <FaTrashAlt className='text-xs' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'all' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider'>
                <tr>
                  <th className='p-4'>Property</th>
                  <th className='p-4'>Price</th>
                  <th className='p-4'>Status</th>
                  <th className='p-4 text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {allListings.map((listing) => (
                  <tr
                    key={listing._id}
                    className='border-b border-slate-50 hover:bg-slate-50/60 transition-colors'
                  >
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <img
                          src={
                            listing.imageUrls?.[0] ||
                            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150'
                          }
                          alt=''
                          className='w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0'
                        />
                        <div className='truncate max-w-xs'>
                          <p className='font-bold text-slate-800 truncate'>{listing.name}</p>
                          <p className='text-xs text-slate-400 truncate'>{listing.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className='p-4 font-bold text-blue-600'>
                      ₹{Number(listing.regularPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td className='p-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          listing.approved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {listing.approved ? 'Live / Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className='p-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          to={`/listing/${listing._id}`}
                          className='p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors'
                          title='View'
                        >
                          <FaExternalLinkAlt className='text-xs' />
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className='bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 p-2.5 rounded-xl transition-all'
                          title='Delete'
                        >
                          <FaTrashAlt className='text-xs' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider'>
                <tr>
                  <th className='p-4'>User</th>
                  <th className='p-4'>Email</th>
                  <th className='p-4'>Role</th>
                  <th className='p-4 text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className='border-b border-slate-50 hover:bg-slate-50/60 transition-colors'
                  >
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <img
                          src={
                            u.avatar ||
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                          }
                          alt=''
                          className='w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0'
                        />
                        <span className='font-bold text-slate-800'>{u.username}</span>
                      </div>
                    </td>
                    <td className='p-4 text-slate-500 text-xs'>{u.email}</td>
                    <td className='p-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className='p-4 text-right'>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className='bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 p-2 rounded-xl transition-all'
                          title='Delete User'
                        >
                          <FaTrashAlt className='text-xs' />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
