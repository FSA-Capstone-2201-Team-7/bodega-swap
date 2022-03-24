import React from "react";

function Footer() {
  return (
    <footer className="grid grid-cols-3 px-8 pt-10 border-t-gray-400 border absolute bottom-0 left-0 right-0">
      <div className="col-span-1">
        <h2 className="text-lg font-bold">Bodega Swap</h2>
      </div>
      <div className="flex col-span-2 justify-between">
        <ul className="flex-cols  text-gray-700  text-sm ">
          <h3 className="font-semibold pb-2">Shop</h3>
          <li>Mobile App</li>
          <li>Categories</li>
          <li>Shop Local</li>
        </ul>
        <ul className="flex-cols text-gray-700  text-sm ">
          <h3 className="font-semibold pb-2">Support</h3>
          <li>Contact Us</li>
          <li>Help Center</li>
          <li>Trader Protection</li>
          <li>Safty Guidelines</li>
        </ul>
        <ul className="flex-cols  text-gray-700  text-sm">
          <h3 className="font-semibold pb-2">Policy Center</h3>
          <li>Terms of Service</li>
          <li>Privacy</li>
          <li>Prohibited Items</li>
          <li>Prohibited Conduct</li>
        </ul>
        <ul className="flex-cols  text-gray-700  text-sm">
          <h3 className="font-semibold pb-2">Company</h3>
          <li>About Us</li>
          <li>Blog</li>
          <li>Careers</li>
        </ul>
      </div>
      <div className=" justify-between">
        <p className="text-gray-500">
          Copyright &copy; <span className="year">2022</span> Bodega Swap, Inc.
          All rights reserved.
        </p>
        <div className="soscial links"></div>
      </div>
    </footer>
  );
}

export default Footer;
