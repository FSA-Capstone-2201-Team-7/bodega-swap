import "./App.css";
import Routing from "./Routes";

const App = () => {
  return (
    <div className="bg-white">
      <Routing />
    </div>
  );
};

export default App;

// o: this should go

// import "./App.css";
// import { useState, useEffect } from "react";
// import { supabase } from "./supabaseClient";
// import Auth from "./componentss/Auth";
// import Account from "./componentss/Account";
// import "./index.css";

// const App = () => {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     setSession(supabase.auth.session());

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return (
//     <div className="container" style={{ padding: "50px 0 100px 0" }}>
//       {!session ? (
//         <Auth />
//       ) : (
//         <Account key={session.user.id} session={session} />
//       )}
//     </div>
//   );
// };

// export default App;

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
