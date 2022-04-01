import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LoadingPage from './LoadingPage';

const ConfirmationCard = (props) => {
  const [comSwap, setComSwap] = useState({});
  const [loading, setloading] = useState(true);
  const { swap, inOrOut } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const checkCompleted = async () => {
      try {
        setloading(true);
        if (swap.inbound_confirm === true && swap.outbound_confirm === true) {
          await supabase
            .from('swaps')
            .update({
              status: 'complete',
            })
            .eq('id', swap.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkCompleted();
  }, [swap]);

  useEffect(() => {
    const fetchSwap = async () => {
      try {
        setComSwap(swap);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    fetchSwap();
  }, [swap]);
  supabase
    .from('swaps')
    .on('UPDATE', (update) => {
      setComSwap(update.new);
    })
    .subscribe();

  console.log('com', comSwap);

  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      <div className="flex rounded overflow-hidden shadow-lg opacity-50">
        <img className="h-80 w-96" src={swap.inbound_offer.image_url} alt="" />
        <img className="h-80 w-96" src={swap.outbound_offer.image_url} alt="" />
      </div>
      {comSwap.outbound_confirm === true && comSwap.inbound_confirm === true ? (
        <button
          type="button"
          className="rounded overflow-hidden shadow-lg w-full h-14 bg-gray-500"
          onClick={() => navigate('/rating', { state: { swap } })}
        >
          Rate Your Swapmate!
        </button>
      ) : (
        <button className="btn rounded overflow-hidden shadow-lg w-full h-14 bg-gray-500 loading">
          Waiting...
        </button>
      )}
    </div>
  );
};

export default ConfirmationCard;
