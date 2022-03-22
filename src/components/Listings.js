import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const Listings = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const user = supabase.auth.user();

  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select("*")
          .eq("userId", user.id);

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setItems(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getListings();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div>
          {items.map((item, idx) => {
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
