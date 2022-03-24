import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import EditAccount from "./components/EditAccount";
import {
  Main,
  HaggleView,
  TradesAndMessages,
  CreateProposal,
  AllItems,
  CreateListing,
} from "./components";
import NavBar from "./components/NavBar";
import Profile from "./components/MyAccount";

import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useNavigate } from "react-router";
import SingleItem from "./components/SingleItem";
import Wishlist from "./components/Wishlist";
import AddUser from "./components/AddUser";
import OwnerProfile from "./components/OwnerProfile";
import Footer from "./components/Footer";

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
    <div className="relative min-h-screen">
      <NavBar session={session} />
      {!session ? (
        <main className="mx-auto max-w-7xl px-8 sm:px-16 pb-52">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Main />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/items" element={<AllItems />} />
            <Route exact path="/items/:id" element={<SingleItem />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
      ) : (
        <main className="pb-52">
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
            <Route exact path="/myAccount" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route exact path="/items" element={<AllItems />} />
            <Route exact path="/items/:id" element={<SingleItem />} />
            <Route
              exact
              path="/items/:id/OwnerProfile"
              element={<OwnerProfile />}
            />
            <Route path="/createListing" element={<CreateListing />} />
          </Routes>
        </main>
      )}
      <Footer />
    </div>
  );
};
export default Routing;
