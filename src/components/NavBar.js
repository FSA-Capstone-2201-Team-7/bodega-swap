import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const NavBar = ({ session }) => {
  const navigate = useNavigate();
  console.log(localStorage);
   return (
     <div className="nav">
       {!session ? (
         <nav>
           <Link to="/home">Home</Link>
           <Link to="login">Login</Link>
           <Link to="/items">View Items</Link>
         </nav>
       ) : (
         <nav>
           <Link to="/home">Home</Link>
           <div>---</div>
           <Link to="/profile">Profile</Link>
           <div>---</div>
           <Link to="/messages">Messages</Link>
           <div>---</div>
           <Link to="/haggle">haggletest</Link>
           <div>---</div>
           <Link
             className="navLink"
             to="/"
             onClick={async () => {
               await supabase.auth.signOut();
               navigate(`/home`);
             }}
           >
             logout
           </Link>
           <div>-----</div>
           <Link to="/items">View Items</Link>
         </nav>
       )}
     </div>
   );

}
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
