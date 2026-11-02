import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';

export default function SignIn() {
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
      dispatch(signInSuccess(data));

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const fillDemoAccount = () => {
    setFormData({
      email: 'demo@mern-estate.com',
      password: 'demo1234',
    });
  };

  return (
    <div className='p-4 max-w-md mx-auto min-h-[80vh] flex flex-col justify-center'>
      <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-3'>
            🏠
          </div>
          <h1 className='text-3xl font-black text-slate-800 tracking-tight'>
            Welcome <span className='text-blue-600'>Back</span>
          </h1>
          <p className='text-xs text-slate-400 mt-1'>
            Sign in to access your saved properties, listings, and messages
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='relative'>
            <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
            <input
              type='email'
              placeholder='Email Address'
              className='w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              id='email'
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className='relative'>
            <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              className='w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              id='password'
              required
              value={formData.password}
              onChange={handleChange}
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
            className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-blue-100 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-1'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Quick Sign-in */}
        <div className='mt-4 pt-4 border-t border-slate-100'>
          <button
            type='button'
            onClick={fillDemoAccount}
            className='w-full py-2 px-3 bg-blue-50 hover:bg-blue-100/80 text-blue-700 rounded-xl text-xs font-bold transition-colors'
          >
            ⚡ Click to Fill Demo User (demo@mern-estate.com)
          </button>
        </div>

        {error && (
          <p className='text-rose-600 text-xs mt-4 text-center font-bold bg-rose-50 p-3 rounded-xl border border-rose-100'>
            {error}
          </p>
        )}

        <div className='flex items-center justify-between mt-6 text-xs font-semibold'>
          <p className='text-slate-500'>Don't have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-600 font-bold hover:underline'>Create Account</span>
          </Link>
        </div>

        <div className='mt-4 pt-4 border-t border-slate-100 text-center'>
          <Link
            to='/admin/login'
            className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors'
          >
            <FaUserShield className='text-xs' /> Admin Portal Access
          </Link>
        </div>
      </div>
    </div>
  );
}
