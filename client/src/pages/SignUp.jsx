import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className='p-4 max-w-md mx-auto min-h-[80vh] flex flex-col justify-center'>
      <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-3'>
            ✨
          </div>
          <h1 className='text-3xl font-black text-slate-800 tracking-tight'>
            Create <span className='text-blue-600'>Account</span>
          </h1>
          <p className='text-xs text-slate-400 mt-1'>
            Join RealEstate to post properties and discover dream homes
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='relative'>
            <FaUser className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
            <input
              type='text'
              placeholder='Full Username'
              className='w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              id='username'
              required
              minLength='3'
              onChange={handleChange}
            />
          </div>

          <div className='relative'>
            <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
            <input
              type='email'
              placeholder='Email Address'
              className='w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              id='email'
              required
              onChange={handleChange}
            />
          </div>

          <div className='relative'>
            <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Create Strong Password'
              className='w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all'
              id='password'
              required
              minLength='6'
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
            {loading ? 'Creating Account...' : 'Sign Up Free'}
          </button>
        </form>

        {error && (
          <p className='text-rose-600 text-xs mt-4 text-center font-bold bg-rose-50 p-3 rounded-xl border border-rose-100'>
            {error}
          </p>
        )}

        <div className='flex items-center justify-between mt-6 text-xs font-semibold'>
          <p className='text-slate-500'>Already have an account?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-600 font-bold hover:underline'>Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
