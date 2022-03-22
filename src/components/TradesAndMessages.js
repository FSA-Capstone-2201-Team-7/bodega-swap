import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';


const TradesAndMessages = () => {
  const [loading, setLoading] = useState(true);

  const [getInbound, setInbound] = useState([]);
  const [getOutbound, setOutbound] = useState([]);
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    const getInboundSwaps = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('swaps')
          .select(
            `
            inbound_id,
            outbound_id,
            id,
            inbound_offer,
            status, 
            outbound_offer
            `
          )
          .eq('inbound_id', user.id);
        setOutbound(data);
      } catch (error) {
        console.error('try again', error);
      } finally {
        setLoading(false);
      }
    };
    getInboundSwaps();
  }, [user.id]);

  useEffect(() => {
    const getAllSwaps = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
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
          .eq('outbound_id', user.id);

        setInbound(data);
      } catch (error) {
        console.error('try again', error);
      } finally {
        setLoading(false);
      }
    };
    getAllSwaps();
  }, [user.id]);
  

  const handleActivate = async (swap) => {
    if (swap.status === 'pending') {
      await supabase
        .from('swaps')
        .update({
          status: 'active',
        })
        .eq('id', swap.id);
    }
    navigate('/haggle', { state: { swap } });
  };

  return loading ? (
    <div>Loding...</div>
  ) : (
    <div>
      messages
      <h2>In-bound</h2>
      {getInbound.length > 0 ? (
        <div>
          {getInbound.map((swap) => {
            return (
              <div
                key={swap.id}
                className="max-w-sm rounded overflow-hidden shadow-lg"
              >
                <div className="flex mb-4">
                  <img
                    src={swap.outbound_offer.image_url}
                    alt=""
                    className="w-1/2"
                  />
                  <img
                    src={swap.inbound_offer.image_url}
                    alt=""
                    className="w-1/2"
                  />
                </div>
                {swap.status === 'active' ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => handleActivate(swap)}
                  >
                    Currently active
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => handleActivate(swap)}
                  >
                    Activate!
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        'no current trades'
      )}
      <div>out-bound</div>
      {getOutbound.map((swap) => {
        return (
          <div
            key={swap.id}
            className="max-w-lg rounded overflow-hidden shadow-lg"
          >
            <div className="flex mb-4">
              <img
                src={swap.outbound_offer.image_url}
                alt=""
                className="w-1/2"
              />
              <img
                src={swap.inbound_offer.image_url}
                alt=""
                className="w-1/2"
              />
            </div>
            <button
              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => navigate('/haggle', { state: { swap } })}
            >
              Haggle!
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TradesAndMessages;
