import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishList] = useState(null);
  const user = supabase.auth.user();

  useEffect(() => {
    const getWishlist = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("wishlist_items")
          .select(`*, items(id, name, image_url, description, listed)`)
          .eq("user_id", user.id);

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setWishList(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getWishlist();
  }, []);

  const handleRemove = async (e, id) => {
    e.preventDefault();
    try {
      let { data, error, status } = await supabase
        .from("wishlist_items")
        .delete()
        .match({ item_id: id }, { user_id: user.id })
        .limit(1)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setWishList(wishlist.filter((item) => item.items.id !== data.item_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : wishlist.length ? (
    <div className="grid grid-cols-3  gap-10 ">
      <h3 className="col-span-3">My Wishlist</h3>
      {wishlist.map((item, idx) => {
        return (
          <div key={idx} className="single-item-container">
            <Link to={`/items/${item.items.id}`}>
              <img className="h-96 w-96" src={item.items.image_url} alt="" />
            </Link>
            <p>{item.items.name}</p>

            <Link to="/haggle" state={{ item }}>
              <button
                className="cursor-pointer mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white w-full hover:bg-indigo-500"
                type="button"
              >
                Haggle
              </button>
            </Link>
            <button
              type="button"
              className="cursor-pointer mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white w-full hover:bg-red-500"
              onClick={(e) => handleRemove(e, item.items.id)}
            >
              Remove From Wishlist
            </button>
          </div>
        );
      })}
    </div>
  ) : (
    <div>Your Wishlist is Empty!</div>
  );
};

export default Wishlist;
