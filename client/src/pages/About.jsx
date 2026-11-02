import React from 'react';
import {
  FaAward,
  FaHandshake,
  FaUsers,
  FaShieldAlt,
  FaGem,
  FaRocket,
  FaBuilding,
  FaCheckCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className='py-16 px-4 max-w-6xl mx-auto flex flex-col gap-16'>
      {/* Hero Header */}
      <div className='text-center flex flex-col gap-4 max-w-3xl mx-auto'>
        <span className='text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full w-fit mx-auto'>
          About RealEstate
        </span>
        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900'>
          Redefining the Future of{' '}
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>
            Modern Living
          </span>
        </h1>
        <p className='text-slate-600 text-base sm:text-lg leading-relaxed'>
          We are committed to making property transactions honest, effortless, and accessible. From first apartments to luxury dream homes, we guide you every step of the journey.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <div className='bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-3 group'>
          <div className='w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300'>
            <FaBuilding />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Who We Are</h2>
          <p className='text-slate-600 leading-relaxed text-sm'>
            RealEstate is a technology-driven real estate platform built to simplify home hunting in India. We connect verified buyers, owners, and renters directly without hidden brokerage.
          </p>
        </div>

        <div className='bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-3 group'>
          <div className='w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300'>
            <FaRocket />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Our Mission</h2>
          <p className='text-slate-600 leading-relaxed text-sm'>
            Our mission is complete transparency. We strive to empower every individual and family to find their sanctuary with total peace of mind and zero predatory surprises.
          </p>
        </div>

        <div className='bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-3 group'>
          <div className='w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300'>
            <FaGem />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Curated Quality</h2>
          <p className='text-slate-600 leading-relaxed text-sm'>
            Every home shown on our platform meets stringent quality guidelines: verified addresses, high-resolution imagery, and accurate descriptions so your time is respected.
          </p>
        </div>

        <div className='bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-3 group'>
          <div className='w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300'>
            <FaHandshake />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Direct Connection</h2>
          <p className='text-slate-600 leading-relaxed text-sm'>
            Connect immediately via phone call, WhatsApp, or instant messaging. Speak directly with the property owner and negotiate the deal that fits your budget.
          </p>
        </div>

        <div className='bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-3 group'>
          <div className='w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300'>
            <FaShieldAlt />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Safe & Secure</h2>
          <p className='text-slate-600 leading-relaxed text-sm'>
            Built on robust authentication, spam detection, encrypted communications, and secure tokenization to safeguard your personal credentials and investments.
          </p>
        </div>

        <div className='bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-3 group'>
          <div className='w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300'>
            <FaAward />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Award-Winning AI</h2>
          <p className='text-slate-600 leading-relaxed text-sm'>
            Our integrated RealEstate AI chatbot answers questions about market rates, legal documentation, and neighborhood trends 24 hours a day, 7 days a week.
          </p>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className='bg-white p-10 rounded-3xl border border-slate-100 shadow-md grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
        <div>
          <p className='text-3xl sm:text-4xl font-black text-blue-600'>₹500Cr+</p>
          <p className='text-slate-500 font-medium text-xs sm:text-sm mt-1'>Property Value Listed</p>
        </div>
        <div>
          <p className='text-3xl sm:text-4xl font-black text-blue-600'>15,000+</p>
          <p className='text-slate-500 font-medium text-xs sm:text-sm mt-1'>Active Buyers & Tenants</p>
        </div>
        <div>
          <p className='text-3xl sm:text-4xl font-black text-blue-600'>50+</p>
          <p className='text-slate-500 font-medium text-xs sm:text-sm mt-1'>Metropolitan Cities</p>
        </div>
        <div>
          <p className='text-3xl sm:text-4xl font-black text-blue-600'>24/7</p>
          <p className='text-slate-500 font-medium text-xs sm:text-sm mt-1'>AI Instant Support</p>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 sm:p-14 rounded-3xl text-white text-center shadow-xl flex flex-col items-center gap-6'>
        <h2 className='text-3xl sm:text-4xl font-extrabold max-w-2xl'>
          Ready to Find Your Place in the World?
        </h2>
        <p className='text-blue-100 max-w-xl text-sm sm:text-base'>
          Join thousands of homeowners and renters who trust RealEstate for their property transactions every day.
        </p>
        <div className='flex flex-wrap gap-4 justify-center'>
          <Link
            to='/search'
            className='bg-white text-blue-600 hover:bg-slate-50 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-105'
          >
            Start Exploring
          </Link>
          <Link
            to='/create-listing'
            className='bg-blue-800/60 hover:bg-blue-800 text-white border border-blue-300/30 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all'
          >
            List a Property
          </Link>
        </div>
      </div>
    </div>
  );
}
