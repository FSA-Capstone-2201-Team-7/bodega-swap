import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TutorialPage = () => {
  return (
    <div>
      <h1>Learn How to Use Bodega Swap!</h1>
      <div>
        <p>Desktop Tutorials:</p>
        <ul>
          <li>
            <Link to="/tutorials/desktop/signup">Signup/Create Account</Link>
          </li>
          <li>Edit Account</li>
          <li>List An Item</li>
          <li>Edit a Listing</li>
          <li>Propose a Trade</li>
        </ul>
      </div>
      <div>
        <p>Mobile Tutorials:</p>
        <ul>
          <li>Signup/Create Account</li>
          <li>Edit Account</li>
          <li>List An Item</li>
          <li>Edit a Listing</li>
          <li>Propose a Trade</li>
        </ul>
      </div>
    </div>
  );
};

export default TutorialPage;
