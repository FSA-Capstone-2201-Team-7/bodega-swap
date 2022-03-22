import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const NavBar = ({ session }) => {
  const navigate = useNavigate();
  console.log(localStorage);
  return (
    <header className="sticky top-0 z-50 flex justify-between bg-white p-5 shadow-md md:px-10">
      <div className="flex">
        <Link to="/home">
          <h1 className="text-bold">BODEGA SWAP</h1>
        </Link>

        <Link className="text-gray-500 pl-5" to="/items">
          View Items
        </Link>
      </div>

      {!session ? (
        <nav className="flex items-center justify-end space-x-4 text-gray-500">
          <Link to="login">Login</Link>
          <Link to="signup">SignUp</Link>
        </nav>
      ) : (
        <nav className="flex items-center justify-end space-x-4 text-gray-500">
          <Link to="/home">Home</Link>

          <Link to="/profile">Profile</Link>

          <Link to="/messages">Messages</Link>
          <Link to="/account">My Account</Link>

          <Link
            className="navLink"
            to="/"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate(`/home`);
            }}
          >
            Logout
          </Link>
        </nav>
      )}
    </header>
  );
};
//   return (
//     <div className="nav">
//       {!session ? (
//         <nav>
//           <Link to="/home">Home</Link>
//           <Link to="/login">Login</Link>
//           <Link to="/items">View Items</Link>
//         </nav>
//       ) : (
//         <nav>
//           <Link to="/home">Home</Link>
//           <Link to="/profile">Profile</Link>
//           <Link to="/items">View Items</Link>
//           <Link
//             className="navLink"
//             to="/"
//             onClick={async () => {
//               await supabase.auth.signOut();
//               navigate(`/home`);
//             }}
//           >
//             logout
//           </Link>
//         </nav>
//       )}
//     </div>
//   );
// };

export default NavBar;
