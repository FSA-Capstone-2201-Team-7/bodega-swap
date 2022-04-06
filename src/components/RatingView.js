import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
const RatingView = () => {
  const [rated, setRated] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [exchange, setExchange] = useState({
    myNewItem: null,
    myOffer: null,
  });
  const user = supabase.auth.user();
  const navigate = useNavigate();
  const location = useLocation();
  const { swap = "" } = location.state || {};

  
  useEffect(() => {
    //determine whether the current user is the sender or receiver of the original proposal,
    //and whether or not they have already voted
    if (user.id === swap.inbound_id) {
      setTargetId(swap.outbound_id);
      setRated(swap.inbound_rated);
      setExchange({
        myNewItem: swap.inbound_offer.id,
        myOffer: swap.outbound_offer.id,
      });
    } else {
      setTargetId(swap.inbound_id);
      setRated(swap.outbound_rated);
      setExchange({
        myNewItem: swap.outbound_offer.id,
        myOffer: swap.inbound_offer.id,
      });
    }
  }, [user.id, swap]);

  const handleRating = async (e, type) => {
    e.preventDefault();
    const vote = type === "up" ? "upvote" : "downvote";
    try {
      let { error } = await supabase.rpc([vote], {
        target_id: targetId,
        user_id: user.id,
      });
      /* upvote and downvote are functions that are written into our database on the backend. Depending on which one is called, a target user's upvote or downvote tally will be incremented by 1, AND the logged in user's swaps_completed will be incremented */
      if (error) throw error;
    } catch (error) {
      console.error(error);
    } finally {
      /* the supabase mini-ORM does not yet have a good way to update multiple tables at once,
      so here we had to nest a secondary database query in order to both register the vote and change the inbound/outbound_rated status on the swap in question. MIGHT be able to modify the upvote/downvote function to do this */
      try {
        const userRole =
          user.id === swap.inbound_id ? "inbound_rated" : "outbound_rated";
        let { data, error } = await supabase
          .from("swaps")
          .update({ [userRole]: true })
          .eq("id", swap.id)
          .limit(1)
          .single();

        if (error) throw error;

        if (data.inbound_rated && data.outbound_rated) {
          await supabase
            .from("swaps")
            .update({
              status: "rated",
            })
            .eq("id", data.id);

          let { error } = await supabase.rpc("swap", {
            user1: user.id,
            user2: targetId,
            item1: exchange.myOffer,
            item2: exchange.myNewItem,
          });

          if (error) console.error(error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setRated(true);
        toast.success("Thanks for rating!", {
          icon: "⭐️",
        });
        navigate("/myAccount");
      }
    }
  };
  return rated ? (
    <div className="flex justify-center text-2xl font-bold text-indigo-900">
      Thanks for rating!
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-2xl font-bold">
      <div className="flex gap-7">
        <button
          className="p-3 bg-red-500 rounded-full motion-safe:animate-bounce"
          onClick={(e) => handleRating(e, "down")}
          type="button"
        >
          <ThumbDownIcon className="h-8  fill-yellow-400 stroke-yellow-500" />
        </button>
        <button
          className="animate-bounce  p-3 bg-indigo-500 rounded-full "
          onClick={(e) => handleRating(e, "up")}
          type="button"
        >
          <ThumbUpIcon className="h-8  fill-yellow-400 stroke-yellow-500" />
        </button>
      </div>

      <p className="mt-5  text-gray-600">
        Rate your swapmate! Our community is built on trust, so please be fair!
      </p>
    </div>
  );
};

export default RatingView;
