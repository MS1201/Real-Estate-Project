import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Chatbot from './components/Chatbot';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col justify-between bg-slate-50 selection:bg-blue-600 selection:text-white'>
        <Header />
        <main className='flex-grow'>
          <Routes>
            {/* Public Routes - Accessible to all visitors */}
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/search' element={<Search />} />
            <Route path='/listing/:listingId' element={<Listing />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/admin/login' element={<AdminLogin />} />

            {/* Authenticated User Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/create-listing' element={<CreateListing />} />
              <Route path='/update-listing/:listingId' element={<UpdateListing />} />

              {/* Admin Protected Routes */}
              <Route element={<AdminRoute />}>
                <Route path='/admin' element={<AdminPanel />} />
                <Route path='/admin-dashboard' element={<AdminPanel />} />
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}
