import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EditAccount from './components/EditAccount';
import {
  Main,
  HaggleView,
  TradesAndMessages,
  CreateProposal,
  AllItems,
  CreateOrEditListing,
} from './components';
import NavBar from './components/NavBar';
import Profile from './components/MyAccount';
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from 'react-router-dom';
import { useNavigate } from 'react-router';
import SingleItem from './components/SingleItem';
import Wishlist from './components/Wishlist';
import AddUser from './components/AddUser';
import OwnerProfile from './components/OwnerProfile';
import Footer from './components/Footer';
import RatingView from './components/RatingView';
import TutorialPage from './components/tutorial/Tutorial';
import DesktopSignup from './components/tutorial/desktop/DesktopSignup';
import DesktopListing from './components/tutorial/desktop/DesktopListing';

const Routing = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="flex-col flex h-full justify-between ">
      <NavBar session={session} />
      {!session ? (
        <main className=" px-8 sm:px-16 pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Main session={session} />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/items" element={<AllItems />} />
            <Route exact path="/items/:id" element={<SingleItem />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route exact path="/tutorials" element={<TutorialPage />} />
            <Route
              path="/tutorials/desktop/signup"
              element={<DesktopSignup />}
            />
            <Route
              path="/tutorials/desktop/listing"
              element={<DesktopListing />}
            />
          </Routes>
        </main>
      ) : (
        <main className="px-8 sm:px-16 pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Main />} />
            <Route
              exact
              path="/editProfile"
              element={<EditAccount key={session.user.id} session={session} />}
            />
            <Route exact path="/messages" element={<TradesAndMessages />} />
            <Route exact path="/haggle" element={<HaggleView />} />
            <Route exact path="createproposal" element={<CreateProposal />} />
            <Route
              path="/addUser"
              element={<AddUser key={session.user.id} session={session} />}
            />
            <Route path="/rating" element={<RatingView />} />
            <Route exact path="/myAccount" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route exact path="/items" element={<AllItems />} />
            <Route exact path="/items/:id" element={<SingleItem />} />
            <Route
              exact
              path="/items/:id/OwnerProfile"
              element={<OwnerProfile />}
            />
            <Route
              path="/createListing"
              element={<CreateOrEditListing mode="create" />}
            />
            <Route
              path="/myAccount/editListing/:id"
              element={<CreateOrEditListing mode="edit" />}
            />
            <Route exact path="/tutorials" element={<TutorialPage />} />
            <Route
              path="/tutorials/desktop/signup"
              element={<DesktopSignup />}
            />
            <Route
              path="/tutorials/desktop/listing"
              element={<DesktopListing />}
            />
          </Routes>
        </main>
      )}
      <Footer />
    </div>
  );
};
export default Routing;
