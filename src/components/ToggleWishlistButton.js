import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ToggleWishlistButton = (props) => {
  const [onWishlist, setOnWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isOnWishlist = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('wishlist_items')
          .select(`item_id, user_id`)
          .match({ user_id: props.userId, item_id: props.itemId });

        if (error && status !== 406) {
          throw error;
        }

        if (data.length) setOnWishlist(true);
        else setOnWishlist(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    isOnWishlist();
  }, []);

  const toggleWishlist = async (e, itemId, userId) => {
    e.preventDefault();

    if (onWishlist) {
      try {
        let { error, status } = await supabase
          .from('wishlist_items')
          .delete()
          .match({ item_id: props.itemId }, { user_id: props.userId });

        if (error && status !== 406) {
          throw error;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOnWishlist(false);
      }
    } else {
      try {
        let { error, status } = await supabase
          .from('wishlist_items')
          .upsert([{ user_id: props.userId, item_id: props.itemId }]);

        if (error && status !== 406) {
          throw error;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOnWishlist(true);
      }
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <button
      type="button"
      onClick={(e) => toggleWishlist(e, props.itemId, props.userId)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
    >
      {onWishlist ? 'remove from wishlist' : 'add to wishlist'}
    </button>
  );
};

//changing something

export default ToggleWishlistButton;
