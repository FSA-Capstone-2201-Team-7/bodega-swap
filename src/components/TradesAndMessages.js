/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '@material-tailwind/react/Button';
import Popover from '@material-tailwind/react/Popover';
import PopoverContainer from '@material-tailwind/react/PopoverContainer';
import PopoverHeader from '@material-tailwind/react/PopoverHeader';
import PopoverBody from '@material-tailwind/react/PopoverBody';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Card from './Card';

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
            outbound_offer,
            inbound_accept,
            outbound_accept
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
              status,
              outbound_accept,
              inbound_accept
              
              `
          )
          .eq('outbound_id', user.id);
console.log('inbound', data)
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
      const { data } = await supabase
        .from('swaps')
        .update({
          status: 'active',
        })
        .eq('id', swap.id);
      // console.log(data);
      if (data) {
       const {data: conversation } = await supabase.from('conversations').insert([
          {
            sender_Id: user.id,
            receiver_Id: swap.inbound_id
          },
        ]);
        if(conversation) {
          console.log('conversation', conversation)
        }
      }
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
  const handleRemoveProposal = async (swap) => {
    try {
      const { data, error, status } = await supabase
        .from('swaps')
        .delete()
        .eq('id', swap.id);

      if (error && status !== 406) {
        throw error;
      }

      const render = getInbound.filter((active) => {
        if (active.id !== swap.id) {
          return active;
        }
      });
      setInbound(render);

  
    } catch (error) {
      console.error(error);
    }
  };

  // o: consider sub-components below
  return loading ? (
    <div>Loding...</div>
  ) : (
    <div className="flex grid grid-cols-2">
      <div className="flex justify-center grid grid-cols pb-10 sm:px-5 gap-x-8 gap-y-16">
        {getInbound.length > 0 ? (
          <div>
            {getInbound.map((swap) => {
              return (
                <div key={swap.id}>
                  <div className=" flex rounded overflow-hidden shadow-lg">
                    <Card
                      imageUrl={swap.outbound_offer.image_url}
                      id={swap.outbound_offer.id}
                      firstButton={
                        swap.status === 'active' ? (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => handleActivate(swap)}
                          >
                            Currently active
                          </button>
                        ) : (
                          <div className="flex">
                            <button
                              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                              onClick={() => handleActivate(swap)}
                            >
                              ACCEPT MEETING
                            </button>
                          </div>
                        )
                      }
                    />
                    <SwapHorizIcon sx={{ fontSize: 125 }} className="mt-28" />
                    <Card
                      imageUrl={swap.inbound_offer.image_url}
                      id={swap.inbound_offer.id}
                      firstButton={
                        swap.status === 'active' ? (
                          <div className="flex">
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
                                  Here we can list breif information about the
                                  user and their rep?
                                </PopoverBody>
                              </PopoverContainer>
                            </Popover>
                          </div>
                        ) : (
                          <div className="flex">
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
                                    onClick={() => handleRemoveProposal(swap)}
                                  >
                                    {' '}
                                    YES I'M SURE
                                  </button>
                                </PopoverBody>
                              </PopoverContainer>
                            </Popover>
                          </div>
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          'no current trades'
        )}
      </div>

      <div className="flex justify-center grid grid-cols pb-10 sm:px-5 gap-x-8 gap-y-16">
        {getOutbound.map((swap) => {
          return (
            <div key={swap.id}>
              <div className=" flex rounded overflow-hidden shadow-lg">
                <Card
                  imageUrl={swap.inbound_offer.image_url}
                  id={swap.inbound_offer.id}
                  firstButton={
                    swap.status === 'pending' ? (
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
                          className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                          onClick={() =>
                            navigate('/haggle', { state: { swap } })
                          }
                        >
                          Haggle!
                        </button>
                      </div>
                    )
                  }
                />
                <SwapHorizIcon sx={{ fontSize: 125 }} className="mt-28" />
                <Card
                  imageUrl={swap.outbound_offer.image_url}
                  id={swap.outbound_offer.id}
                  firstButton={
                    <div>
                      <button
                        type="button"
                        className="hover:bg-blue-700 bg-red-500 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleRemoveOffer(swap)}
                      >
                        Remove Offer
                      </button>
                    </div>
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradesAndMessages;
