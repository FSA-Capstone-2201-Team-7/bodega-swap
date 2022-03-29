import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router';

const CreateProposal = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [swap, setSwap] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [defaultImage, setDefault] = useState([
    'http://dummyimage.com/140x100/ddd.png/dddddd/000000',
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const user = supabase.auth.user();
  const { item = '' } = location.state || {};

  //this first checks if any swaps are currently made between two users
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
          .eq('outbound_id', item.ownerId);
        setSwap(data);
        if (!data) {
          const { data: reversed, error } = await supabase
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
            .eq('outbound_id', user.id)
            .eq('inbound_id', item.ownerId);
          setSwap(reversed);
        }
      } catch (error) {
        console.error('try again', error);
      }
    };
    getAllSwaps();
  }, [user, item]);

  //this gets all the users items to render them into the view to pick from
  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('items')
          .select('*')
          .eq('ownerId', user.id);

        if (data) {
          setUserItems(data);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getListings();
  }, [user.id, swap.id]);

  const handleSubmit = (image, item) => {
    setDefault([image, item]);
  };

  //creates the new swap after submitting propopsal
  const handleProposal = async (outbound) => {
    if (outbound) {
     await supabase.from('swaps').insert([
        {
          inbound_id: user.id,
          status: 'proposed',
          outbound_id: item.ownerId,
          inbound_offer: item,
          outbound_offer: outbound,
        },
      ]);

      navigate('/messages');
    }
    
  };

  



  return loading ? (
    <div>Loading</div>
  ) : (
    swap[0] ? (<div>you already have an open trade with this trader</div>):(
    <div>
      <div className="flex mb-4">
        <img src={item.image_url} alt="" className="w-1/2" />
        <button
          onClick={() => handleProposal(defaultImage[1])}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {' '}
          Submit Proposal
        </button>
        <img src={defaultImage[0]} alt="" className="w-1/2" />
      </div>
      <div className="Swapitems">
        {userItems.map((item, idx) => {
          return (
            <div
              key={item.id}
              className="max-w-sm rounded overflow-hidden shadow-lg"
            >
              <img src={item.image_url} alt="" className="w-full" />
              <button
                type="button"
                onClick={() => handleSubmit(item.image_url, item)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Offer
              </button>
            </div>
          );
        })}
      </div>
    </div>
    )

  )
  


};

export default CreateProposal;
