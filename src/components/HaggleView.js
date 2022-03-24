import React from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import Chat from './Chat';


const HaggleView = ({state}) => {
 const location = useLocation(null);
 const user = supabase.auth.user();
 const { swap = '' } = location.state || {};

 console.log(swap)
 console.log('user', user)

  return (
    <div>
      <div className="HaggleprofileViews">Profiles</div>

      <div className="flex mb-4">
        <div className="w-1/2object-conatain h-100 w-96 rounded overflow-hidden shadow-lg">
          <div>Owner Item </div>
          <img src={swap.inbound_offer.image_url} alt="" />
        </div>
        <div className="w-1/2  object-conatain h-100 w-96 rounded overflow-hidden shadow-lg">
          <div>Haggler Item</div>
          <img src={swap.outbound_offer.image_url} alt="" />
        </div>
      </div>
      <div className="haggleChat">Chat</div>
      <Chat />
    </div>
  );
};
export default HaggleView;


