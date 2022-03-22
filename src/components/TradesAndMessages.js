import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';


const TradesAndMessages = () => {
  const [loading, setLoading] = useState(true);
  
  const [getInbound, setInbound] = useState(null)
  const [getOutbound, setOutbound] = useState(null)
  const user = supabase.auth.user();


  useEffect(() => {
    const getAllSwaps = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `
            inbound_id,
            outbound_id,
            id,
            inbound_offer,
            outbound_offer,
            status
            `
          )
          .eq('inbound_id', user.id)
          
        setInbound(data);
      } catch (error) {
        console.error('try again', error);
      }
    };
    getAllSwaps();
  }, [user.id]);
  console.log('inboundTrades', getInbound)

  useEffect(() => {
    const getAllSwaps = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `
            inbound_id,
            outbound_id,
            id,
            inbound_offer,
            outbound_offer,
            status
            `
          )
          .eq('outbound_id', user.id);

        setOutbound(data);
        // if(!data ) {
        //   let { data: outBounditems } = await supabase.from('items').select(`*`).eq('id', data);
        // }
      } catch (error) {
        console.error('try again', error);
      }
    };
    getAllSwaps();
  }, [user.id]);
console.log('outboundtrades', getOutbound)

  return (
  <div>
    messages
  </div>
  );
};

export default TradesAndMessages;
