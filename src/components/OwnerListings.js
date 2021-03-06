import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
function OwnerListings({ user }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getListings();
  }, [user.id]);
  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10 mt-4 justify-items-center ">
          {items.map((item, idx) => {
            return (
              <div key={idx} className="w-96 rounded overflow-hidden shadow-xl">
                <Link to={`/items/${item.id}`}>
                  <img className="h-96 w-96" src={item.image_url} alt="" />
                </Link>

                <div className="card-body">
                  <p className="card-title">{item.name}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OwnerListings;
