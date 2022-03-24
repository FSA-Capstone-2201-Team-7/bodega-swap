import React from "react";

function Footer() {
  return (
    <footer className="grid grid-cols-3 px-8 py-10 border-t-gray-400 border absolute bottom-0 left-0 right-0">
      <div>
        <h2 className="text-lg font-bold">Bodega Swap</h2>
      </div>
      <div>
        <ul className="flex space-x-4 text-gray-700 font-bold text-sm ">
          <li>Mobile App</li>
          <li>Community</li>
          <li>About Us</li>
        </ul>
      </div>
      <div>
        <p className="text-gray-500">
          Copyright &copy; <span className="year">2022</span> Bodega Swap, Inc.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
