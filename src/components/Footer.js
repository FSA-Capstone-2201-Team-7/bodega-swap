import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="">
      <div className="bg-indigo-50 grid grid-cols-1 lg:grid-cols-3 pt-5 md:pt-10 gap-y-4 ">
        <div className="col-span-1 flex flex-col items-center md:items-start md:pl-32">
          <h2 className="text-lg text-indigo-900 font-bold mb-3">
            Bodega Swap
          </h2>
          <div className="text-sm text-indigo-300">
            <div className="flex gap-4">
              <div>
                <a href="https://github.com/bgskinner3">
                  <img
                    src="https://bcmquwtslvmqbutdhiyo.supabase.co/storage/v1/object/public/avatars/0.9761480856816476.jpg"
                    alt="Brennen Github Page"
                    className="rounded-full h-10 w-10 hover:scale-110 border-2 border-indigo-400 shadow-lg hover:animate-pulse"
                  />
                </a>
              </div>
              <div>
                <a href="https://github.com/cjforbz">
                  <img
                    src="https://bcmquwtslvmqbutdhiyo.supabase.co/storage/v1/object/public/avatars/0.6984229953899443.jpeg"
                    alt="Colin Github Page"
                    className="rounded-full h-10 w-10 border-2 hover:scale-110 border-indigo-400 hover:animate-pulse"
                  />
                </a>
              </div>
              <div>
                <a href="https://github.com/kaitlyn601">
                  <img
                    src="https://bcmquwtslvmqbutdhiyo.supabase.co/storage/v1/object/public/avatars/0.11614336049774399.png"
                    alt="Kaitlyn Github Page"
                    className="rounded-full h-10 w-10 border-2 shadow-lg border-indigo-400 hover:scale-110 hover:animate-pulse "
                  />
                </a>
              </div>

              <div>
                <a href="https://github.com/FSA-Capstone-2201-Team-7/bodega-swap">
                  <GitHubIcon
                    sx={{ fontSize: 40 }}
                    className="hover:scale-110 hover:animate-bounce"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:col-span-2 md:justify-between">
          <ul className="flex-cols  md:pl-14 text-indigo-300 text-sm ">
            <h3 className="font-semibold pb-2 text-indigo-500">Shop</h3>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Mobile App
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Categories
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Shop Local
            </li>
          </ul>
          <ul className="flex-cols text-indigo-300 text-sm ">
            <h3 className="font-semibold pb-2 text-indigo-500">Support</h3>
            <li className="cursor-pointer hover:scale-110  hover:text-indigo-400 ">
              Contact Us
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Help Center
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Trader Protection
            </li>
            <li className="cursor-pointer hover:scale-110">Safty Guidelines</li>
          </ul>
          <ul className="flex-cols text-indigo-300  text-sm">
            <h3 className="font-semibold pb-2 text-indigo-500">
              Policy Center
            </h3>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Terms of Service
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Privacy
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Prohibited Items
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Prohibited Conduct
            </li>
          </ul>
          <ul className="flex-cols md:pr-14 lg:pr-24 text-indigo-300 text-sm">
            <h3 className="font-semibold pb-2 text-indigo-500">Company</h3>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              About Us
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Blo4
            </li>
            <li className="cursor-pointer hover:scale-110 hover:text-indigo-400 ">
              Careers
            </li>
          </ul>
        </div>
        <p className="text-indigo-300 py-1 md:pl-14  lg:col-span-1 lg:pl-24 text-sm bg-indigo-500">
          Copyright &copy; <span className="year">2022</span> Bodega Swap, Inc.
          All rights reserved.
        </p>
        <div className="hidden md:flex lg:col-span-2 py-1 justify-end md:pr-14 lg:pr-24 space-x-2 bg-indigo-500">
          <TwitterIcon className="cursor-pointer" />
          <InstagramIcon className="cursor-pointer" />
          <FacebookIcon className="cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
