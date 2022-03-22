import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const TradesAndMessages = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [getSwap, setSwap] = useState(null)
  const [getInbound, setInbound] = useState(null)
  const [getOutbound, setOutbound] = useState(null)
  const user = supabase.auth.user();


  //get all 'inbound swap and items' 
  useEffect(() => {
    const getInboundSwaps = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `
            inbound_id,
            id,
            inbound_offer,
            status, 
            outbound_offer
            `
          )
          .eq('inbound_id', user.id)
          setInbound(data)

          if (data) {
            const { data: inboundItem } = await supabase
              .from('items')
              .select(`*, users:ownerId(username)`)
              .eq('id', data[0].inbound_offer);
            setInbound([...data, ...inboundItem, ]);
          }
          console.log('length', getInbound.length)
          if(getInbound.length === 2) {
            const { data: outBoundItem } = await supabase
              .from('items')
              .select(`*, users:ownerId(username)`)
              .eq('id', data[0].outbound_offer);
            setInbound([...getInbound, ...outBoundItem]);
          }
        
      } catch (error) {
        console.error('try again', error);
      }
    };
    getInboundSwaps();
  }, [user.id]);


  console.log('items', getInbound)





//   useEffect(() => {
//     const getAllSwaps = async () => {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from('swaps')
//           .select(
//             `
//             inbound_id,
//             outbound_id,
//             id,
//             inbound_offer,
//             outbound_offer,
//             status
//             `
//           )
//           .eq('outbound_id', user.id);

//         setOutbound(data);
//         // if(!data ) {
//         //   let { data: outBounditems } = await supabase.from('items').select(`*`).eq('id', data);
//         // }
//       } catch (error) {
//         console.error('try again', error);
//       }
//     };
//     getAllSwaps();
//   }, [user.id]);
// console.log('outboundtrades', getOutbound)

  return (
  <div>
    messages
    <div>
      In-bound
    </div>
    <div>
      out-bound
    </div>
  </div>
  );
};

export default TradesAndMessages;
