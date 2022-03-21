import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const AllItems = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);

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
        setItems(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div>
          {items.map((item, idx) => {
            return (
              <div key={idx} className="single-item-container">
                <p>{item.name}</p>
                <p>{item.description}</p>
                <Link to={`/items/${item.id}`}>
                  <img src={item.image_url} alt="" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllItems;
