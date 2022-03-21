import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { HaggleView } from '.';

const TradesAndMessages = () => {
  // const [swapInfo, setSwap] = useState({});
  //  const [loading, setLoading] = useState(true);
  //  useEffect(() => {
  //    getBarter();

  //  }, []);
  // // will move to differe component then pass swapinfo through params
  // const getBarter = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from('swaps')
  //       .select()
  //       .match({ id: 1 });
  //     if (data) {
  //       setSwap(data[0]);
  //     }
  //   } catch (error) {
  //     console.error('try agina', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // console.log('here', swapInfo)

  return <div>hello</div>;
};

export default TradesAndMessages;
