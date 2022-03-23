import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const NavBar = ({ session }) => {
  const navigate = useNavigate();
  console.log(localStorage);
  return (
    <header className="sticky top-0 flex justify-between bg-white p-5 shadow-md md:px-10">
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
          <Link to="/messages">Messages</Link>
          <Link to="/myAccount">My Account</Link>
          <Link to="/wishlist">Wishlist</Link>

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

export default NavBar;
