import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Account from "./components/Account";
import {
  Main,
  HaggleView,
  TradesAndMessages,
  CreateProposal,
  AllItems,
  Listings,
} from './components';
import NavBar from "./components/NavBar";
import Profile from "./components/UserProfile";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useNavigate } from "react-router";
import SingleItem from "./components/SingleItem";

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
    <div>
      <NavBar session={session} />
      {!session ? (
        <main className="mx-auto max-w-7xl px-8 sm:px-16">
          <Routes>
            <Route exact path="/home" element={<Main />} />
            <Route exact path="/login" element={<Auth />} />
     
            <Route exact path="/items" element={<AllItems />} />
            <Route path="/items/:id" element={<SingleItem />} />
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </main>
      ) : (
        <main>
          <Routes>
            <Route exact path="/home" element={<Main />} />
            <Route
              exact
              path="/profile"
              element={<Account key={session.user.id} session={session} />}
            />

            <Route exact path="/messages" element={<TradesAndMessages />} />
            <Route exact path="/haggle" element={<HaggleView />} />
            <Route exact path="createproposal" element={<CreateProposal />} />
            <Route exact path="/items" element={<AllItems />} />
            <Route path="/items/:id" element={<SingleItem />} />
            <Route path="/account" element={<Profile />} />
          </Routes>
        </main>
      )}
    </div>
  );
};
export default Routing;

// import './App.css';
// import { useState, useEffect } from 'react';
// import { supabase } from './supabaseClient';
// import Auth from './components/Auth';
// import Account from './components/Account';
// import './index.css';

// const App = () => {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     setSession(supabase.auth.session());

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return (
//     <div className="container" style={{ padding: '50px 0 100px 0' }}>
//       {!session ? (
//         <Auth />
//       ) : (
//         <Account key={session.user.id} session={session} />
//       )}
//     </div>
//   );
// };
