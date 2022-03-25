import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import ToggleWishlistButton from "./ToggleWishlistButton";
import Card from "./Card";

const SingleItem = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from("items")
        .select(`*, users:ownerId(username)`)
        .eq("id", params.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setItem(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="single-item-container">
          <Card
            name={item.name}
            id={item.id}
            description={item.description}
            imageUrl={item.image_url}
            firstButton={
              user ? (
                <ToggleWishlistButton userId={user.id} itemId={item.id} />
              ) : (
                <></>
              )
            }
            secondButton={
              user ? (
                <button
                  type="button"
                  onClick={() => navigate("OwnerProfile", { state: { item } })}
                >
                  <p>Owner: {item.users.username}</p>
                </button>
              ) : (
                <h3>
                  <p>Owner: {item.users.username}</p>
                </h3>
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default SingleItem;
// {
//   /* <p>{item.name}</p>
//           <button
//             type="button"
//             onClick={() => navigate('OwnerProfile', { state: { item } })}
//           >
//             <p>Owner: {item.users.username}</p>
//           </button>

//           <p>{item.description}</p>
//           <img src={item.image_url} alt="" />
//           {user ? (
//             <ToggleWishlistButton userId={user.id} itemId={item.id} />
//           ) : (
//             <></>
//           )} */
// }
