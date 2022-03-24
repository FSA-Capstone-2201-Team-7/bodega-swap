import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const FilterCategory = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(null);

    useEffect(() => {
      const filter = async () => {
        try {
          setLoading(true);
          const { data } = await supabase.from('items').select();
          if (data) {
            setItems(data);
          }
          
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      filter()
    }, [])
    

  return (
    <div>
      <div>filter </div>
    </div>
  );
};

export default FilterCategory;
