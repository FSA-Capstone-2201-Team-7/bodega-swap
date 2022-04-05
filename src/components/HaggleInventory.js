import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Card from './Card';

const HaggleInventory = (props) => {
  const [userItems, setUserItems] = useState([]);
  const [inventorySwap, setSwap] = useState({});
  const [ids, setIds] = useState([]);
  const userInfo = supabase.auth.user();
  let { user, swap, setTraderItem, setUserItem, inOrOut, items } = props;

 
  useEffect(() => {
    const getInventory = async () => {
      try {
        let isMounted = true;
      
        let fetchIds = [];

        if (isMounted) {
          const { data } = await supabase
            .from('items')
            .select('*')
            .eq('ownerId', user);
          if (data) {
            setUserItems(data);
          }
          if (items && data) {
            items.forEach((item) => {
              fetchIds.push(item.id);
            });
            setIds(fetchIds);
          }
        }
      } catch (error) {
        console.error(error);
      } 
    };
    getInventory();
  }, [user, items]);

  useEffect(() => {
    const fetchSwap = async () => {
      try {
        setSwap(swap);
        
      } catch (error) {
        console.error(error);
      } 
    };
    fetchSwap();
  }, [swap, inOrOut, setTraderItem]);

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
           setTraderItem(update.new.inbound_items);
       
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
           setTraderItem(update.new.outbound_items);
      
         })
         .subscribe();
         
      }
    } catch (error) {
      console.error(error);
    } 
  };

  return (
    <div>
      {userItems.map((item) => {
        return (
          <div className="p-5" key={item.id}>
            <Card id={item.id} imageUrl={item.image_url} />

            {user === userInfo.id && !ids.includes(item.id) ? (
              <button
                type="button"
                className="btn btn-wide w-full"
                onClick={() => handleSwitch(item)}
              >
                Add Item
              </button>
            ) : (
              <button type="button" className="btn btn-wide w-full" disabled>
                Already Up For Trade
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HaggleInventory;
