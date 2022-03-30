import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
const Wishlist = () => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishList] = useState(null);
  const navigate = useNavigate();
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
    <LoadingPage />
  ) : wishlist.length ? (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10 mt-5 justify-items-center ">
        <h3 className="md:col-span-2 col-span-1 lg:col-span-3 text-2xl ">
          My Wishlist
        </h3>
        {wishlist.map((item, idx) => {
          return (
            <div key={idx} className="rounded overflow-hidden shadow-xl">
              <Link to={`/items/${item.items.id}`}>
                <img className="h-80 w-96" src={item.items.image_url} alt="" />
              </Link>
              <div className="card-body flex flex-row justify-between pb-1 ">
                <p className="card-title ">{item.items.name}</p>
              </div>
              <div className="card-actions  justify-between mt-5 pb-3  px-6">
                <button
                  type="button"
                  className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-red-500"
                  onClick={(e) => handleRemove(e, item.items.id)}
                >
                  Remove From Wishlist
                </button>
                <button
                  className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400"
                  type="button"
                  onClick={() =>
                    navigate("/createproposal", { state: { item } })
                  }
                >
                  Create Proposal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>Your Wishlist is Empty!</div>
  );
};

export default Wishlist;
