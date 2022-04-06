import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Card from './Card';

const HaggleInventory = (props) => {
  const [userItems, setUserItems] = useState([]);
  const [inventorySwap, setSwap] = useState({});
  const [ids, setIds] = useState([]);
  const [disable, setDisabled] = useState(false);
  const userInfo = supabase.auth.user();
  let { user, swap, setTraderItem, setUserItem, inOrOut, items } = props;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getInventory();
    await fetchSwap();
    const subscription = addItemsSubscription();
    return () => {
      supabase.removeSubscription(subscription);
    };
  };
  const getInventory = async () => {
    try {
      let fetchIds = [];

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
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSwap = async () => {
    try {
      setSwap(swap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitch = async (item) => {
    try {
      if (inOrOut === 'outbound') {
        await supabase
          .from('swaps')
          .update({
            inbound_items: [...items, item],
          })
          .eq('id', inventorySwap.id);
      }
      if (inOrOut === 'inbound') {
        await supabase
          .from('swaps')
          .update({
            outbound_items: [...items, item],
          })
          .eq('id', inventorySwap.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addItemsSubscription = () => {
    if (inOrOut === 'inbound') {
      return supabase
        .from('swaps')
        .on('UPDATE', (update) => {
          setTraderItem(update.new.outbound_items);
          setUserItem(update.new.inbound_items);
        })
        .subscribe();
    }
    if (inOrOut === 'outbound') {
      return supabase
        .from('swaps')
        .on('UPDATE', (update) => {
          setTraderItem(update.new.inbound_items);
          setUserItem(update.new.outbound_items);
        })
        .subscribe();
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
