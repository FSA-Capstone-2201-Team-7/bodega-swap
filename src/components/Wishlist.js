import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishList] = useState(null);
  const user = supabase.auth.user();

  useEffect(() => {
    const getWishlist = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('wishlists')
          .select(`*, items(*)`)
          .eq('user_id', user.id);

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setWishList(data[0].items);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getWishlist();
  });

  const handleRemove = async (e, id) => {
    e.preventDefault();
    try {
      let { data, error, status } = await supabase
        .from('wishlist_items')
        .delete()
        .match({ item_id: id }, { wishlist_id: wishlist.id });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setWishList(wishlist.filter((item) => item.id !== data[0].item_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="grid grid-cols-3  gap-10 ">
      {wishlist.map((item, idx) => {
        return (
          <div key={idx} className="single-item-container">
            <p>{item.name}</p>
            <p>{item.description}</p>
            <Link to={`/items/${item.id}`}>
              <img src={item.image_url} alt="" />
            </Link>
            <Link to="/haggle" state={{ item }}>
              <button type="button">Haggle!---</button>
            </Link>
            <button type="button" onClick={(e) => handleRemove(e, item.id)}>
              \\\Remove From Wishlist
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Wishlist;
