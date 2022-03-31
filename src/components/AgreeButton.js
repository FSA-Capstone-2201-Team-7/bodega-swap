import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';





const H = ({ state }) => {
   const location = useLocation(null);
   const { swap = '' } = location.state || {};
   const [loading, setLoading] = useState(true);
   const [userObj, setUserObj] = useState({})
   const [userItem, setUserItem] = useState({})
   const [userAccept, setUserAccept] = useState({})
   const [notUserId, setNotUserId] = useState('');
   const [traderObj, setTraderObj] = useState({})
   const [traderItem, setTraderItem] = useState({})
   const [traderAccept, setTraderAccept] = useState({})
   
  
  
   const [inventory, setInventory] = useState('');
   const user = supabase.auth.user();
   const navigate = useNavigate();

  useEffect(() => {
    const userInfo = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl,
          username
          `
          )
          .eq('id', user.id);
        setUserObj(data);
        if (swap.outbound_id === user.id) {
          setUserItem({ ...swap.outbound_offer });
          setNotUserId(swap.outbound_id);
          setTraderItem({ ...swap.inbound_offer });
          setUserAccept({
            userAccept: swap.outbound_accept,
            inOrOut: 'outbound',
          });
          setTraderAccept({
            userAccept: swap.inbound_accept,
            inOrOut: 'inbound',
          });
        }
        if (swap.inbound_id === user.id) {
          setUserItem({ ...swap.inbound_offer });
          setNotUserId(swap.inbound_id);
          setTraderItem({ ...swap.outbound_offer });
          setUserAccept({
            userAccept: swap.inbound_accept,
            inOrOut: 'inbound',
          });
          setTraderAccept({
            userAccept: swap.outbound_accept,
            inOrOut: 'outbound',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    userInfo()
  }, [swap.outbound_offer, swap.inbound_offer, swap.outbound_id, swap.inbound_id, user.id, swap.inbound_accept, swap.outbound_accept]);

  useEffect(() => {
    const trader = async () => {
      try {
         setLoading(true);
         const { data } = await supabase
           .from('users')
           .select(
             `
          avatarUrl,
          username

          `
           )
           .eq('id', notUserId);
           setTraderObj(data)
        
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    trader()
  }, [notUserId])
 
  return(
    <div>
      hello
    </div>
  )
};

export default H