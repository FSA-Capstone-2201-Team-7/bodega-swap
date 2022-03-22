import React from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';



const HaggleView = ({state}) => {
 const location = useLocation(null);
 const user = supabase.auth.user();
 const { swap = '' } = location.state || {};
 console.log('current swap', swap)
  return (
    <div>
      <div className="HaggleprofileViews">Profiles</div>
     
      <div className="Haggleitems">
        items
      </div>
      <div className="haggleChat">Chat</div>
    </div>
  );
};
export default HaggleView;


