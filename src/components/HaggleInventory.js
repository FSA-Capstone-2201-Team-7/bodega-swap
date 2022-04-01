import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Card from "./Card";
import LoadingPage from "./LoadingPage";
const HaggleInventory = (props) => {
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventorySwap, setSwap] = useState({})
  const userInfo = supabase.auth.user();
  let { user, swap, setItem } = props;

  useEffect(() => {
    const getInventory = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("items")
          .select("*")
          .eq("ownerId", user);
        if (data) {
          setUserItems(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getInventory();
  }, [user]);

  const handleSwitch = async (item) => {
    try {
      // if(item) {
      //   const {data} = await supabase
      //   .from('swaps')
      //   .update({

      //   })
      // }
      setItem(item)
      console.log('item obj invetory', item)
      console.log('swap in inventory', swap)
    } catch (error) {
      console.error(error)
    }
  };
  console.log(userInfo.id)

  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      {userItems.map((item) => {
        return (
          <div className="p-5" key={item.id}>
            <Card id={item.id} imageUrl={item.image_url} />
            {user === userInfo.id ? (
               <button
              type="button"
              className="btn btn-wide w-full"
              onClick={() => handleSwitch(item)}
            >
              Swap-In
            </button>

            ) : (
              <></>
            ) }
           
          </div>
        );
      })}
    </div>
  );
};

export default HaggleInventory;
