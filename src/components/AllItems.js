import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";



const AllItems = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const user = supabase.auth.user()
  const navigate = useNavigate()
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase.from("items").select();

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

  const handleProposal = (id, item) => {
    if(user.id === id) {
      navigate('/account')
      console.log(true)
    } else {
      navigate('/createproposal', {state: {item}})
    }
  }
  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="grid grid-cols-3  gap-10 ">
          {items.map((item, idx) => {
            return (
              <div key={idx} className="single-item-container">
                <p>{item.name}</p>
                <p>{item.description}</p>
                <Link to={`/items/${item.id}`}>
                  <img src={item.image_url} alt="" />
                </Link>
                {/* <Link to="/createproposal" state={{ item }}> */}
                  <button type="button" onClick={() => handleProposal(item.ownerId, item)}>{item.ownerId === user.id ? ("Go to Account") : (
                    'Create Proposal'
                  )}</button>
                {/* </Link> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllItems;
