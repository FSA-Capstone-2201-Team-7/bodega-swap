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
  console.log(getInbound);
  const handleRemoveOffer = async (swap) => {
    try {
      const { data, error, status } = await supabase
        .from('swaps')
        .delete()
        .eq('id', swap.id);

      if (error && status !== 406) {
        throw error;
      }
      console.log(swap.outbound_id, user.id);
      if (swap.outbound_id === user.id) {
        console.log(true);
      }
      const render = getOutbound.filter((active) => {
        if (active.id !== swap.id) {
          return active;
        }
      });

      setOutbound(render);
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? (
    <div>Loding...</div>
  ) : (
    <div>
      <div className="flex justify-center bg-blue-500 grid grid-cols-24 pb-10 sm:px-5 gap-x-8 gap-y-16">
        messages
        <h2>Pending offers</h2>
        {getInbound.length > 0 ? (
          <div>
            {getInbound.map((swap) => {
              return (
                <div
                  key={swap.id}
                  className="max-w-lg bg-red-500 rounded overflow-hidden shadow-lg"
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
                    <div className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleActivate(swap)}
                      >
                        Currently active
                      </button>
                      <Button
                        color="lightBlue"
                        ref={buttonRef}
                        ripple="light"
                        className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        CHECK USERS REP
                      </Button>

                      <Popover placement="top" ref={buttonRef}>
                        <PopoverContainer>
                          <PopoverHeader>USERNAME?</PopoverHeader>
                          <PopoverBody>
                            Here we can list breif information about the user
                            and their rep?
                          </PopoverBody>
                        </PopoverContainer>
                      </Popover>
                    </div>
                  ) : (
                    <div className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleActivate(swap)}
                      >
                        ACCEPT MEETING
                      </button>
                      <Button
                        color="lightBlue"
                        ref={buttonRef}
                        ripple="light"
                        className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        REJECT MEETING
                      </Button>

                      <Popover placement="top" ref={buttonRef}>
                        <PopoverContainer>
                          <PopoverHeader>Are you sure? </PopoverHeader>
                          <PopoverBody>
                            Rejecting meetings may hurt your rep and the
                            possiblity for any future offers
                            <button
                              type="button"
                              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            >
                              {' '}
                              YES I'M SURE
                            </button>
                          </PopoverBody>
                        </PopoverContainer>
                      </Popover>
                      {/* <button
                      type="button"
                      className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Reject meeting
                    </button> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          'no current trades'
        )}
      </div>
      <div className="flex bg-red-500 grid grid-cols-24 pb-10 sm:px-5 gap-x-8 gap-y-16">
        <div>out-bound</div>
        {getOutbound.map((swap) => {
          return (
            <div
              key={swap.id}
              className="max-w-lg bg-blue-500 rounded overflow-hidden shadow-lg"
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
              <div className="flex">
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
            </div>
          );
         
        })
        }
        
        <div>
          <img
            src="http://dummyimage.com/140x100/ddd.png/dddddd/000000"
            alt=""
            className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm max-h-56"
          />
        </div>
      </div>
    </div>
  );
};

export default TradesAndMessages;
