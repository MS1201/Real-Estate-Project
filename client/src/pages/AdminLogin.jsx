import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { FaUserShield, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (data.role !== 'admin') {
        dispatch(signInFailure('Access denied: This account is not an administrator.'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/admin');
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@mern-estate.com',
      password: 'admin123',
    });
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4 bg-slate-50'>
      <div className='max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100'>
        <div className='bg-gradient-to-r from-purple-800 to-indigo-900 p-8 text-white text-center'>
          <div className='bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm'>
            <FaUserShield className='text-3xl text-purple-200' />
          </div>
          <h1 className='text-2xl font-bold'>Administrator Portal</h1>
          <p className='text-purple-200 text-xs mt-1'>Restricted platform governance & listing approvals</p>
        </div>

        <div className='p-8'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='relative'>
              <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
              <input
                type='email'
                placeholder='admin@mern-estate.com'
                className='w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium transition-all'
                id='email'
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            <div className='relative'>
              <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Admin Password'
                className='w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium transition-all'
                id='password'
                onChange={handleChange}
                value={formData.password}
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              disabled={loading}
              className='bg-purple-700 hover:bg-purple-800 text-white p-3.5 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all shadow-md shadow-purple-200 disabled:opacity-50 mt-1'
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          {/* Quick Admin Credential Fill */}
          <div className='mt-4 pt-4 border-t border-slate-100'>
            <button
              type='button'
              onClick={fillAdminCredentials}
              className='w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors'
            >
              👑 Fill Admin Credentials (admin@mern-estate.com)
            </button>
          </div>

          {error && (
            <p className='text-rose-600 mt-4 text-center font-bold text-xs bg-rose-50 p-3 rounded-xl border border-rose-100'>
              {error}
            </p>
          )}

          <div className='mt-6 pt-6 border-t border-slate-100 text-center'>
            <Link
              to='/'
              className='text-slate-500 hover:text-blue-600 text-xs font-semibold transition-colors'
            >
              ← Back to Main Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
