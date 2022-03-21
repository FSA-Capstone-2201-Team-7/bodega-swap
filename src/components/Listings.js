import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../store/listings";

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const user = supabase.auth.user();
  console.log("user.id", user.id);
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);
  useEffect(() => {
    dispatch(fetchListings(user.id));
    setLoading(false);
  }, [items]);

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div>
          {listings.map((item, idx) => {
            return (
              <div key={idx}>
                <p>{item.name}</p>
                <p>{item.description}</p>
                <img src={item.image_url} alt="" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Listings;
