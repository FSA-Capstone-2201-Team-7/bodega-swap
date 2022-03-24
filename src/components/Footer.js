import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

function Footer() {
  return (
    <footer className="bg-gray-200 grid grid-cols-3 pt-10 gap-y-4 absolute bottom-0 left-0 right-0">
      <div className="col-span-1 pl-24">
        <h2 className="text-lg font-bold mb-3">Bodega Swap</h2>
        <address className="text-sm text-gray-500">
          <p className="address">
            5 Hanover Square 11th floor, New York, NY 10004
          </p>
          <p>
            <a className="footer-link" href="tel:415-201-6370">
              800-201-6370
            </a>
            <br />
            <a className="footer-link" href="/home">
              hello@bodegaswap.com
            </a>
          </p>
        </address>
      </div>
      <div className="flex col-span-2 justify-between">
        <ul className="flex-cols  text-gray-700  text-sm ">
          <h3 className="font-semibold pb-2">Shop</h3>
          <li className="cursor-pointer">Mobile App</li>
          <li className="cursor-pointer">Categories</li>
          <li className="cursor-pointer">Shop Local</li>
        </ul>
        <ul className="flex-cols text-gray-700  text-sm ">
          <h3 className="font-semibold pb-2">Support</h3>
          <li className="cursor-pointer ">Contact Us</li>
          <li className="cursor-pointer">Help Center</li>
          <li className="cursor-pointer">Trader Protection</li>
          <li className="cursor-pointer">Safty Guidelines</li>
        </ul>
        <ul className="flex-cols  text-gray-700  text-sm">
          <h3 className="font-semibold pb-2">Policy Center</h3>
          <li className="cursor-pointer">Terms of Service</li>
          <li className="cursor-pointer">Privacy</li>
          <li className="cursor-pointer">Prohibited Items</li>
          <li className="cursor-pointer">Prohibited Conduct</li>
        </ul>
        <ul className="flex-cols pr-24 text-gray-700  text-sm">
          <h3 className="font-semibold pb-2">Company</h3>
          <li className="cursor-pointer">About Us</li>
          <li className="cursor-pointer">Blog</li>
          <li className="cursor-pointer">Careers</li>
        </ul>
      </div>
      <p className="text-gray-500 py-1 col-span-1 pl-24 text-sm bg-gray-300">
        Copyright &copy; <span className="year">2022</span> Bodega Swap, Inc.
        All rights reserved.
      </p>
      <div className="flex col-span-2 py-1 justify-end pr-24 space-x-2 bg-gray-300">
        <TwitterIcon />
        <InstagramIcon />
        <FacebookIcon />
      </div>
    </footer>
  );
}

export default Footer;
