import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { ChatAltIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchBar from "./SearchBar";

const NavBar = ({ session }) => {
  const navigate = useNavigate();
  // console.log(localStorage);
  return (
    <header className="sticky top-0 flex justify-between bg-white p-5 shadow-md md:px-10 z-40 ">
      <div className="flex">
        <Link to="/home">
          <h1 className="text-bold">BODEGA SWAP</h1>
        </Link>

        <Link className="text-gray-500 pl-5" to="/items">
          Closet
        </Link>
      </div>
      <div className="flex-grow px-7">
        <SearchBar />
      </div>

      {!session ? (
        <nav className="flex items-center justify-end space-x-4 text-white">
          <Link
            className="py-1.5 px-3 hover:bg-indigo-500 bg-indigo-600 rounded-sm"
            to="login"
          >
            Login
          </Link>
          <Link
            className="text-gray-900 py-1.5 px-2.5 border rounded-sm hover:text-white hover:bg-indigo-200 border-indigo-500 hover:border-indigo-200 "
            to="signup"
          >
            SignUp
          </Link>
        </nav>
      ) : (
        <div>
          <nav className="md:hidden dropdown dropdown-end ">
            <label
              tabindex="0"
              className="btn m-1 bg-indigo-500 hover:bg-indigo-400 hover:border-indigo-400 border-violet-400 swap swap-rotate"
            >
              <input type="checkbox" />
              <MenuIcon className="h-6 swap-off" />
              <XIcon className="h-6 swap-on" />
            </label>

            <ul
              tabindex="0"
              className="dropdown-content menu p-2 text-base leading-7 shadow bg-base-100 rounded-sm w-52 border-2 border-b-indigo-500"
            >
              <Link
                className=" hover:text-indigo-500  hover:transition duration-300 ease-out"
                to="/myAccount"
              >
                My Account
              </Link>
              <Link
                className=" hover:text-indigo-500  hover:transition duration-300 ease-out"
                to="/wishlist"
              >
                My Wishlist
              </Link>
              <Link
                className=" hover:text-indigo-500  hover:transition duration-300 ease-out"
                to="/messages"
              >
                My Trades
              </Link>

              <Link
                className=" hover:text-indigo-500  hover:transition duration-300 ease-out"
                to="/createListing"
              >
                List an item
              </Link>
              <Link
                className="hover:text-indigo-500  hover:transition duration-300 ease-out"
                to="/"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate(`/home`);
                }}
              >
                Logout
              </Link>
            </ul>
          </nav>
          <nav className="hidden md:flex md:items-center md:justify-end md:space-x-4 text-gray-500">
            <Link to="/wishlist">
              <FavoriteBorderIcon className="hover:scale-110  hover:text-indigo-500  hover:transition duration-300 ease-out" />
            </Link>
            <Link to="/messages">
              <ChatAltIcon className="h-6 hover:text-indigo-500 hover:transition duration-300 ease-out hover:scale-110" />
            </Link>
            <Link to="/myAccount">
              <PersonIcon className="hover:scale-110 hover:text-indigo-500  hover:transition duration-300 ease-out" />
            </Link>
            <Link to="/createListing">
              {" "}
              <button
                type="button"
                className=" bg-indigo-500 hover:bg-indigo-400
              p-2 text-sm rounded-md text-white"
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
              <LogoutIcon className="hover:scale-110 hover:text-indigo-500  hover:transition duration-200 ease-out" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
