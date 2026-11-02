import { useEffect, useState } from 'react';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${listing.userRef}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data && !data.message) {
          setLandlord(data);
        }
      } catch (error) {
        console.error('Failed to fetch landlord info:', error);
      } finally {
        setLoading(false);
      }
    };
    if (listing?.userRef) {
      fetchLandlord();
    }
  }, [listing?.userRef]);

  if (loading) {
    return (
      <div className='p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl'>
        Loading owner details...
      </div>
    );
  }

  if (!landlord) {
    return (
      <div className='p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl'>
        Unable to load owner information. Please use the phone contact above.
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mt-2'>
      <div className='flex items-center gap-3 pb-3 border-b border-slate-200'>
        <img
          src={
            landlord.avatar ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          }
          alt={landlord.username}
          className='w-10 h-10 rounded-full object-cover border border-slate-300'
        />
        <div className='flex flex-col'>
          <p className='text-xs text-slate-400 font-medium'>Property Owner</p>
          <p className='font-bold text-slate-800 text-sm'>{landlord.username}</p>
        </div>
      </div>

      <label className='text-xs font-bold text-slate-600 mt-1'>
        Send Message regarding "{listing.name}"
      </label>
      <textarea
        rows='3'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Hi, I would like to schedule a viewing or ask a few questions...'
        className='w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white font-medium placeholder:text-slate-400'
      ></textarea>

      <a
        href={`mailto:${landlord.email}?subject=${encodeURIComponent(
          `Inquiry regarding ${listing.name}`
        )}&body=${encodeURIComponent(message)}`}
        className='flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center'
      >
        <FaPaperPlane className='text-[10px]' /> Send Email Inquiry
      </a>
    </div>
  );
}
