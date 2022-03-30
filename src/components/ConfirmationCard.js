import React from 'react';
import { useNavigate } from 'react-router-dom';


const ConfirmationCard = (props) => {
  const { swap, inOrOut } = props;
  const navigate = useNavigate()


console.log(swap.inbound_id)
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
          Rate Your Bro
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
