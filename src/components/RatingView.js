import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';

const RatingView = (props) => {
  const [rated, setRated] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const user = supabase.auth.user();
  const swap = props.swap;
  const navigate = useNavigate();

  useEffect(() => {
    //determine whether the current user is the sender or receiver of the original proposal,
    //and whether or not they have already voted
    if (user.id === swap.inbound_id) {
      setTargetId(swap.outbound_id);
      setRated(swap.inbound_rated);
    } else {
      setTargetId(swap.inbound_id);
      setRated(swap.outbound_rated);
    }
  }, []);

  const handleRating = async (e) => {
    e.preventDefault();
    const vote = e.target.name === 'up' ? 'upvote' : 'downvote';
    try {
      await supabase.rpc(vote, { rate_id: targetId }, { user_id: user.id });
      /* upvote and downvote are functions that are written into our database on the backend. Depending on which one is called, a user's upvote or downvote tally will be incremented by 1 */
    } catch (error) {
      console.error(error);
    } finally {
      /* the supabase mini-ORM does not yet have a good way to update multiple tables at once,
      so here we had to nest a secondary database query in order to both register the vote and change the inbound/outbound_rated status on the swap in question */
      try {
        const userRole =
          user.id === swap.inbound_id ? 'inbound_rated' : 'outbound_rated';
        let { error } = await supabase
          .from('swaps')
          .update({ [userRole]: true })
          .eq('id', swap.id);
        if (error) throw error;
      } catch (error) {
        console.error(error);
      } finally {
        setRated(true);
        alert('Thanks for rating!');
        navigate('/myAccount');
      }
    }
  };
  return rated ? (
    <div>Thanks for rating!</div>
  ) : (
    <div>
      <button onClick={handleRating} type="button" name="down">
        <ThumbDownIcon className="h-8" />
      </button>
      <button onClick={handleRating} type="button" name="up">
        <ThumbUpIcon className="h-8" />
      </button>
      <p>
        Rate your swapmate! Our community is built on trust, so please be fair!
      </p>
    </div>
  );
};

export default RatingView;
