import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { ChatAltIcon } from "@heroicons/react/outline";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const NavBar = ({ session }) => {
  const navigate = useNavigate();
  console.log(localStorage);
  return (
    <header className="sticky top-0 flex justify-between bg-white p-5 shadow-md md:px-10 z-50 ">
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
        <nav className=" flex items-center justify-end space-x-4 text-gray-500">
          <Link to="/wishlist">
            <FavoriteBorderIcon />
          </Link>
          <Link to="/messages">
            <ChatAltIcon className="h-6" />
          </Link>
          <Link to="/myAccount">
            <PersonIcon />
          </Link>
          <Link to="/home">
            {" "}
            <button
              type="button"
              className=" bg-gray-200 p-2 text-sm rounded-md"
            >
              List an item
            </button>
          </Link>
          <Link
            className="navLink"
            to="/"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate(`/home`);
            }}
          >
            <LogoutIcon />
          </Link>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
