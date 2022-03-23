import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function OwnerListings({ user }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  console.log("userOwnerListings", user);
  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select("*")
          .eq("ownerId", user.id);

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
  }, [user.id]);
  console.log("ownerItems", items);
  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="grid grid-cols-2 gap-10  ">
          {items.map((item, idx) => {
            return (
              <div key={idx} className="">
                <p>{item.name}</p>
                <p>{item.description}</p>
                <img className="h-96 w-96" src={item.image_url} alt="" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OwnerListings;
