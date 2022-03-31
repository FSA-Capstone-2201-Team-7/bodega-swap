import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';


const ConfirmationCard = (props) => {
  const { swap, inOrOut } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const checkCompleted = async () => {
      try {
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

  
  return (
    <div>
      <div className="flex rounded overflow-hidden shadow-lg opacity-50">
        <img className="h-80 w-96" src={swap.inbound_offer.image_url} alt="" />
        <img className="h-80 w-96" src={swap.outbound_offer.image_url} alt="" />
      </div>
      {swap.outbound_confirm === true && swap.inbound_confirm === true ? (
        <button
          type="button"
          className="rounded overflow-hidden shadow-lg w-full h-14 bg-gray-500"
          onClick={() => navigate('/rating', { state: { swap } })}
        >
          Rate Your Swap
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
