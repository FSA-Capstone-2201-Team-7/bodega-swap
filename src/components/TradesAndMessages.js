/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '@material-tailwind/react/Button';
import Popover from '@material-tailwind/react/Popover';
import PopoverContainer from '@material-tailwind/react/PopoverContainer';
import PopoverHeader from '@material-tailwind/react/PopoverHeader';
import PopoverBody from '@material-tailwind/react/PopoverBody';

const TradesAndMessages = () => {
  const [loading, setLoading] = useState(true);
  const [getInbound, setInbound] = useState([]);
  const [getOutbound, setOutbound] = useState([]);
  const user = supabase.auth.user();
  const navigate = useNavigate();
  const buttonRef = useRef();

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
    const getOutboundSwaps = async () => {
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
    getOutboundSwaps();
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

  const handleRemoveOffer = async (swap) => {
    try {

      const { data, error, status } = await supabase
        .from('swaps')
        .delete()
        .eq('id', swap.id);
       
      if (error && status !== 406) {
        throw error;
      }
      
      const render = getOutbound.filter(active => {
        if(active.id !== swap.id) {
          return active
        }
      })
    
      setOutbound(render)
    
    
   
    } catch (error) {
      console.error(error);
    } 
    
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

            {swap.status === 'pending' ? (
              <div>
                <Button
                  color="lightBlue"
                  ref={buttonRef}
                  ripple="light"
                  className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Check Status
                </Button>

                <Popover placement="top" ref={buttonRef}>
                  <PopoverContainer>
                    <PopoverHeader>Status: Pending</PopoverHeader>
                    <PopoverBody>
                      Your Proposal Has Not Yet Been Confirmed
                    </PopoverBody>
                  </PopoverContainer>
                </Popover>
              </div>
            ) : (
              <div>
                <button
                  className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => navigate('/haggle', { state: { swap } })}
                >
                  Haggle!
                </button>
              </div>
            )}
            <div>
              <button
                type="button"
                className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => handleRemoveOffer(swap)}
              >
                Remove Offer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TradesAndMessages;
