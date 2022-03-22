import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

const Wishlist = () => {
  const [loading, setLoading] = useState;
  const [wishlist, setWishList] = useState;
  const params = useParams();

  return <div>Hello World</div>;
};

export default Wishlist;
