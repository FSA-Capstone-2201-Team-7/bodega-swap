import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Account from "./components/Account";
import { Main } from "./components";
import NavBar from "./components/NavBar";
import Listings from "./components/Listings";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useNavigate } from "react-router";

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
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <NavBar session={session} />
      {!session ? (
        <main>
          <Routes>
            <Route exact path="/home" element={<Main />} />
            <Route exact path="/login" element={<Auth />} />
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
            <Route path="/listings/:id" element={<Listings />} />
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
