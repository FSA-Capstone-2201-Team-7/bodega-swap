import React from 'react';
import { useNavigate } from 'react-router-dom';


const ConfirmationCard = (props) => {
  const { swap } = props;
  const navigate = useNavigate()



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
          onClick={() => navigate('/', {state: {swap}})}
        >
          Rate Your Bro
        </button>
      ) : (
        <button class="btn rounded overflow-hidden shadow-lg w-full h-14 bg-gray-500 loading">
          Waiting...
        </button>
      )}
    </div>
  );
};

export default ConfirmationCard;
