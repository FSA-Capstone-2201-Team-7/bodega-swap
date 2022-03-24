import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router';

// styles to place in building 

// const styles = {
//   card: {
//     backgroundColor: 'rgba(128, 128, 128, 0.972)',
//     //** keep to build out functionality */
//     //#rgba(255, 255, 255, 0.972) => white
//     borderRadius: 55,
//     width: '20.5rem',
//     height: '20.5rem',
//   },
//   cardImage: {
//     objectFit: 'cover',
//     borderRadius: 55,
//     height: '80%',
//   },
//   containerHolder: {
//     borderRadius: 100,
//     backgroundColor: 'rgba(0, 0, 0, 0.959)',
//     // ** keep to build out functionality
//     //'rgba(128, 128, 128, 0.972)', => grey
//   },
// };

const CreateProposal = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [swap, setSwap] = useState(null);
  const [userItems, setUserItems] = useState(null);
  const [defaultImage, setDefault] = useState([
    'http://dummyimage.com/140x100/ddd.png/dddddd/000000',
  ]);
  const location = useLocation(null);
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
      } catch (error) {
        console.error('try again', error);
      }
    };
    getAllSwaps();
  }, [user, item]);

  //...next if there is no swap currently
  //made between the two this creates it in the database

  useEffect(() => {
    const makeSwap = async () => {
      try {
        if (!swap.length) {
          const { data: newSwap } = await supabase.from('swaps').insert([
            {
              inbound_id: user.id,
              status: 'pending',
              outbound_id: item.ownerId,
              inbound_offer: item,
            },
          ]);
          setSwap(newSwap);
        }
      } catch (error) {
        console.error(error);
      }
    };
    makeSwap();
  }, [swap]);

  //this gets all the users items to render them into the view to pick from
  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('items')
          .select('*')
          .eq('ownerId', user.id);

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUserItems(data);
        }
        console.log(swap.id);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getListings();
  }, [user.id]);

  const handleSubmit = (image, item) => {

    setDefault([image, item]);
  };

  //updates the proposal on click
  const handleProposal = async (outbound) => {
 
    if (outbound) {
      const { data } = await supabase
        .from('swaps')
        .update({
          status: 'pending',
          outbound_offer: outbound,
          inbound_offer: item,
        })
        .eq('id', swap[0].id);

      setSwap(data);
      
    }
    navigate('/messages')
  };


  return loading ? (
    <div>Loading</div>
  ) : (
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
  );
};

export default CreateProposal;
