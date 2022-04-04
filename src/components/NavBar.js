import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { ChatAltIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchBar from "./SearchBar";

const NavBar = ({ session }) => {
  const [navMenuOpen, setNavMenuOpen] = useState(null);
  const navigate = useNavigate();

  const handleNavToggle = () => {
    setNavMenuOpen(!navMenuOpen);
  };

  return (
    <header className="sticky top-0 flex justify-between items-center bg-white p-5 shadow-md md:px-10 z-40 ">
      <div className="flex flex-col md:flex-row md:items-center">
        <Link to="/home">
          <h1 className="text-bold text-lg md:text-2xl">BODEGA SWAP</h1>
        </Link>

        <Link
          className=" font-normal text-gray-500 md:pl-5 hover:text-indigo-500  hover:scale-105 duration-200 ease-out"
          to="/items"
        >
          Explore
        </Link>
      </div>
      <div className="flex-grow px-2 md:px-7">
        <SearchBar />
      </div>

      {!session ? (
        <nav className="flex items-center justify-end space-x-1 md:space-x-4 text-white">
          <Link
            className="py-1 md:py-1.5 px-1.5 md:px-3 hover:bg-indigo-500 bg-indigo-600 border rounded-sm border-indigo-500"
            to="login"
          >
            Login
          </Link>
          <Link
            className="text-gray-900 py-1 md:py-1.5 px-1 md:px-2.5 border rounded-sm hover:text-white hover:bg-indigo-200 border-indigo-500 hover:border-indigo-200 "
            to="signup"
          >
            SignUp
          </Link>
        </nav>
      ) : (
        <div className="flex items-center">
          <nav
            className="md:hidden"
            onClick={() => setNavMenuOpen(!navMenuOpen)}
          >
            <label
              tabIndex="0"
              className="btn m-1 bg-indigo-500 hover:bg-indigo-400 hover:border-indigo-400 border-violet-400 "
            >
              {navMenuOpen ? (
                <XIcon className="h-6" />
              ) : (
                <MenuIcon className="h-6 " />
              )}
            </label>
          </nav>
          {navMenuOpen ? (
            <div className="md:hidden w-100% top-20 shadow-md bg-white right-6 absolute border-2 border-b-indigo-500">
              <ul className="relative">
                <li className="relative">
                  <Link
                    class="flex items-center text-base py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
                    to="/myAccount"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="dark"
                  >
                    My Account
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    className="flex items-center text-base py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
                    to="/wishlist"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="dark"
                  >
                    My Wishlist
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    className="flex items-center text-base py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
                    to="/messages"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="dark"
                  >
                    My Trades
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    className="flex items-center text-base py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
                    to="/createListing"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="dark"
                  >
                    List an Item
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    className="flex items-center text-base py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
                    to="/"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate(`/home`);
                    }}
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="dark"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <></>
          )}

          <nav className="hidden md:flex md:items-center md:justify-end md:space-x-4 text-gray-500">
            <Link to="/wishlist">
              <FavoriteBorderIcon className="hover:scale-110  hover:text-indigo-500  hover:transition duration-200 ease-out" />
            </Link>
            <Link to="/messages">
              <ChatAltIcon className="h-6 hover:text-indigo-500 hover:transition duration-200 ease-out hover:scale-110" />
            </Link>
            <Link to="/myAccount">
              <PersonIcon className="hover:scale-110 hover:text-indigo-500  hover:transition duration-200 ease-out" />
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
