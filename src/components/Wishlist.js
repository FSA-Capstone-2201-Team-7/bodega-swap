import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

const Wishlist = () => {
  const [loading, setLoading] = useState;
  const [wishlist, setWishList] = useState;
  const params = useParams();

  useEffect(() => {
    const getWishlist = async () => {
      try {
        // setLoading(true);
        let { data, error, status } = await supabase
          .from('wishlists')
          .select(`*, items(name, description, image_url)`);
        console.log(data);
      } catch (error) {}
    };
    getWishlist();
  }, []);

  return <div>Hello World</div>;
};

export default Wishlist;
