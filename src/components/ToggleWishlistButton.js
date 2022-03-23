import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ToggleWishlistButton = (props) => {
  // const [onWishlist, setOnWishlist] = useState(isOnWishlist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isOnWishlist = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('wishlists')
          .select(`*, items(*)`)
          .eq('user_id', props.user.id);
        if (data) {
          console.log(data);
          setLoading(false);
          return;
        }
      } catch (error) {}
    };
    isOnWishlist();
  }, []);

  return <div>wishlist</div>;
};

export default ToggleWishlistButton;
