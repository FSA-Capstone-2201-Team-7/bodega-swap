/* eslint-disable array-callback-return */

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Card from "./Card";
import ConfirmationCard from "./ConfirmationCard";
import LoadingPage from "./LoadingPage";

const TradesAndMessages = () => {
  const [loading, setLoading] = useState(true);
  const [getInbound, setInbound] = useState([]);
  const [getOutbound, setOutbound] = useState([]);
  const [getConversationId, setConversationId] = useState('');
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    const getOutboundSwaps = async () => {
      try {
        setLoading(true);
        const { data } = await supabase

          .from('swaps')
          .select()
          .eq('inbound_id', user.id);

        setOutbound(data);
      } catch (error) {
        console.error("try again", error);
      } finally {
        setLoading(false);
      }
    };
    getOutboundSwaps();
  }, [user.id]);


  useEffect(() => {
    const getInboundSwaps = async () => {
      try {
        setLoading(true);
        const { data } = await supabase

          .from('swaps')
          .select()
          .eq('outbound_id', user.id);

        setInbound(data);
      } catch (error) {
        console.error("try again", error);
      } finally {
        setLoading(false);
      }
    };
    getInboundSwaps();
  }, [user.id]);




  const handleActivate = async (swap) => {
    if (swap.status === "proposed") {
      const { data } = await supabase
        .from("swaps")
        .update({
          status: "haggling",
        })
        .eq("id", swap.id);

      if (data) {
        await supabase.from("conversations").insert([
          {
            sender_Id: user.id,
            receiver_Id: swap.inbound_id,
            swap_Id: swap.id,
          },
        ]);
      }
    }

    navigate("/haggle", { state: { swap } });
  };

  const handleRemoveOffer = async (swap) => {
    try {

      const { data } = await supabase
        .from('conversations')
        .select('id')
        .eq('swap_Id', swap.id);
      setConversationId(...data);
      if (data) {
         await supabase
          .from('messages')
          .delete()
          .eq( 'conversations_ID', getConversationId.id )
          
       
            await supabase
              .from('conversations')
              .delete()
              .eq('swap_Id', swap.id);

            await supabase.from('swaps').delete().eq('id', swap.id);

          
          await supabase.from('conversations').delete().eq('swap_Id', swap.id);

          await supabase.from('swaps').delete().eq('id', swap.id);
            
        
      }
      setConversationId('');

    } catch (error) {
      console.error(error);
    }
    navigate('/items')
  };

  // supabase
  //   .from('swaps')
  //   .on('DELETE', (deleted) => {
  //     const render = getOutbound.filter((active) => {
  //       if (active.id !== deleted.old.id) {
  //         return active;
  //       }
  //     });

  //     setOutbound([...render]);
  //   })
  //   .subscribe();


  return loading ? (
    <LoadingPage />
  ) : (
    <div className="flex grid grid-cols-2">
      <div className="flex justify-center grid grid-cols pb-10 sm:px-5 gap-x-8 gap-y-16">
        {getInbound.length > 0 ? (
          <div>
            {getInbound.map((swap) => {
              return (
                <div key={swap.id}>
                  {swap.inbound_confirm === true ? (
                    <ConfirmationCard
                      id={swap.inbound_offer.id}
                      swap={swap}
                      inOrOut="inbound"
                    />
                  ) : (
                    <div className=" flex rounded overflow-hidden shadow-lg">
                      <Card
                        imageUrl={swap.outbound_offer.image_url}
                        id={swap.outbound_offer.id}
                        firstButton={
                          swap.status === "proposed" ? (
                            <div className="flex">
                              <button
                                className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                onClick={() => handleActivate(swap)}
                              >
                                ACCEPT MEETING
                              </button>
                            </div>
                          ) : (
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                              onClick={() => handleActivate(swap)}
                            >
                              Currently active
                            </button>
                          )
                        }
                      />
                      <SwapHorizIcon sx={{ fontSize: 125 }} className="mt-28" />
                      <Card
                        imageUrl={swap.inbound_offer.image_url}
                        id={swap.inbound_offer.id}
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
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          "no current trades"
        )}
      </div>

      <div className="flex justify-center grid grid-cols pb-10 sm:px-5 gap-x-8 gap-y-16">
        {getOutbound.map((swap) => {
          return (
            <div key={swap.id}>
              {swap.outbound_confirm === true ? (
                <ConfirmationCard
                  id={swap.outbound_offer.id}
                  swap={swap}
                  inOrOut="outbound"
                />
              ) : (
                <div className="flex rounded overflow-hidden shadow-lg">
                  <Card
                    imageUrl={swap.inbound_offer.image_url}
                    id={swap.inbound_offer.id}
                    firstButton={
                      swap.status === "proposed" ? (
                        <button className="btn loading">Waiting...</button>
                      ) : (
                        <button
                          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                          onClick={() =>
                            navigate("/haggle", { state: { swap } })
                          }
                        >
                          Haggle!
                        </button>
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradesAndMessages;
