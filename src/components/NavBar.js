import React, { useState } from 'react';

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const handleToggle = () => {
    setNavOpen(!navOpen);
  };
  return (
    <div>
      <div className="nav-container">
        <nav className="nav-bar">
          <h3>Bodega Swap</h3>
          <button onClick={handleToggle}>menu</button>
        </nav>
      </div>
      {navOpen ? (
        <div className="nav-menu">
          <ul>
            <li>Link to items</li>
            <li>Link to trade</li>
            <li>Link to sign in/sign out</li>
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NavBar;
