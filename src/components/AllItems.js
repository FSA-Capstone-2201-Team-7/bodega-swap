import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useEffect } from 'react/cjs/react.production.min';

const AllItems = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase.from('items').select();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <div>{loading ? <p>Loading</p> : <p>hello</p>}</div>;
};

export default AllItems;
