import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Card from './Card';
import LoadingPage from './LoadingPage';
const HaggleInventory = (props) => {
  const [userItems, setUserItems] = useState([]);
  const [loading, setloading] = useState(true);
  const [inventorySwap, setSwap] = useState({});
  const [ids, setIds] = useState([])
  const userInfo = supabase.auth.user();
  let { user, swap, setUserItem, setTraderItem, inOrOut, items } = props;

  useEffect(() => {
    const getInventory = async () => {
      try {
        setloading(true);
        let fetchIds = [];
        const { data } = await supabase
          .from('items')
          .select('*')
          .eq('ownerId', user);

        if (items && data) {
          setUserItems(data);
          items.map((item) => {
            fetchIds.push(item.id);
          });
          setIds(fetchIds);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    getInventory();
  }, [user,items]);

  
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
         
          })
          .subscribe();
          
      }
      
     
    } catch (error) {
      console.error(error);
    } 
  };
  

  console.log(userItems)
  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      {userItems.map((item) => {
        if(item === undefined) {
          console.log('here')
        }
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
              <button
                type="button"
                className="btn btn-wide w-full"
                disabled
              >
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
