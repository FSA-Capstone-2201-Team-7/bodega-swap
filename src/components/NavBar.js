import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';



const NavBar = ({session}) => {

   const navigate = useNavigate();
  console.log(localStorage);
   return (
     <div className="nav">
       {!session ? (
         <nav>
           <Link to="/home">Home</Link>
           <Link to='login'>Login</Link>
         </nav>
       ) : (
         <nav>
           <Link to="/home">Home</Link>
           <Link to="/profile">Profile</Link>
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
         </nav>
       )}
     </div>
   );

}

export default NavBar