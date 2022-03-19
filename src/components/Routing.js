import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Account from './Account';
import Auth from './Auth';

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
