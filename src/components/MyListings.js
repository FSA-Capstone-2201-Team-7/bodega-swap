import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const MyListings = () => {
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
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10 mt-4 justify-items-center ">
          {items.map((item, idx) => {
            return (
              <div key={idx} className="w-96 rounded overflow-hidden shadow-xl">
                <img className="h-96 w-96" src={item.image_url} alt="" />
                <div className="card-body">
                  <p className="card-title">{item.name}</p>
                  <p>{item.description}</p>
                  <div class="card-actions justify-end">
                    <Link
                      className=" cursor-pointer mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400"
                      to={`/myAccount/editListing/${item.id}`}
                    >
                      Edit Listing
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListings;
