import React from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import Chat from './Chat';
import Card from './Card';


const HaggleView = ({state}) => {
 const location = useLocation(null);
 const user = supabase.auth.user();
 const { swap = '' } = location.state || {};

 console.log(swap)
 console.log('user', user)

  return (
    <div>
      <div className="HaggleprofileViews">Profiles</div>

      <div>
        <div className="rounded overflow-hidden shadow-lg">
          <div>Owner Item </div>
          <Card 
          id={swap.inbound_offer.id}
          imageUrl={swap.inbound_offer.image_url}
          />
          
        </div>
        <div className="rounded overflow-hidden shadow-lg">
          <div>Haggler Item</div>
          <Card
          id={swap.outbound_offer.id}
          imageUrl={swap.outbound_offer.image_url}
          />
        </div>
      </div>
      <div className="haggleChat">Chat</div>
      <Chat />
    </div>
  );
};
export default HaggleView;


