import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Card from './Card';
import LoadingPage from './LoadingPage';
const HaggleInventory = (props) => {
  const [userItems, setUserItems] = useState([]);
  const [loading, setloading] = useState(true);
  const [inventorySwap, setSwap] = useState({});
  const userInfo = supabase.auth.user();
  let { user, swap, setUserItem, setTraderItem, inOrOut, items } = props;

  useEffect(() => {
    const getInventory = async () => {
      try {
        setloading(true);
        const { data } = await supabase
          .from('items')
          .select('*')
          .eq('ownerId', user);
        if (data) {
          setUserItems(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getInventory();
  }, [user]);
  useEffect(() => {
    const fetchSwap = async () => {
      try {
        setSwap(swap);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    fetchSwap();
  }, [swap]);


  // used for single item view 
  // const handleSwitch = async (item) => {

  //   try {
  //     if(item && inOrOut === 'outbound') {
  //     await supabase
  //       .from('swaps')
  //       .update({
  //     inbound_offer: item
  //       })
  //     .eq('id', inventorySwap.id);
  //     supabase
  //       .from('swaps')
  //       .on('UPDATE', (update) => {
  //         setSwap(update.new);
  //         setItem(update.new.inbound_offer);
  //         console.log('update', update.new);
  //       })
  //       .subscribe();

  //      }
  //     if(item && inOrOut === 'inbound') {
  //      await supabase
  //        .from('swaps')
  //        .update({
  //          outbound_offer: item,
  //        })
  //        .eq('id', inventorySwap.id);
  //         supabase
  //           .from('swaps')
  //           .on('UPDATE', (update) => {
  //          setSwap(update.new);
  //             setItem(update.new.outbound_offer)
  //             console.log('update', update.new);
  //           })
  //           .subscribe();

  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // };

  const handleSwitch = async (item) => {
    try {
      if (inOrOut === 'outbound') {
        
        await supabase
          .from('swaps')
          .update({
            inbound_items: [...items, item],
          })
          .eq('id', inventorySwap.id);
       
        supabase
          .from('swaps')
          .on('UPDATE', (update) => {
            setSwap(update.new);
      
           setTraderItem(update.new.inbound_items);
            console.log('update in', update.new.inbound_items);
          })
          .subscribe();
      }
      if (inOrOut === 'inbound') {
       await supabase
         .from('swaps')
         .update({
           outbound_items: [...items, item],
         })
         .eq('id', inventorySwap.id);
       
        supabase
          .from('swaps')
          .on('UPDATE', (update) => {
            setSwap(update.new);
          
           setTraderItem(update.new.outbound_items);
            console.log('update out', update.new.outbound_items);
             console.log('update out', update.new);
          })
          .subscribe();
      }
    } catch (error) {
      console.error(error);
    }
  };
console.log('items', items)
console.log('inorout', inOrOut)
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
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HaggleInventory;
