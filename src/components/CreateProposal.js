import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
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
          .select()
          .eq('inbound_id', user.id)
          .eq('outbound_id', item.ownerId)
          .neq('status', 'rated')
        setSwap(data);
        if (!data) {
          const { data: reversed, error } = await supabase
            .from('swaps')
            .select()
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
        console.error(err);
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
    <LoadingPage />
  ) : swap[0] ? (
    <div>you already have an open swap with this swapper</div>
  ) : (
    <div>
      <div className="flex my-8 justify-center">
        <img src={item.image_url} alt="" className="w-80 h-80" />

        <button
          onClick={() => handleProposal(defaultImage[1])}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
         
          Submit Proposal
        </button>
        <img src={defaultImage[0]} alt="" className="w-80 h-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10 mt-5 justify-items-center">
        {userItems.map((item, idx) => {
          return (
            <div
              key={item.id}
              className="rounded overflow-hidden shadow-lg w-80 "
            >
              <img src={item.image_url} alt="" className="w-80 h-80" />
              <div className=" flex justify-end">
              
                <button
                  type="button"
                  onClick={() => handleSubmit(item.image_url, item)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
                >
                  Offer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateProposal;
