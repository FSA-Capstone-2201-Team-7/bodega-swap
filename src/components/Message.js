import React from 'react'
import { supabase } from '../supabaseClient';

const Message = ({message})=> {
  const user = supabase.auth.user();

// here we check if a message is from a user or not then apply the logic into the outter
// div to render the message to the appropriate side
  const isFromUser = () => {
    return user.id === message.sender_Id
  }
  return (
    <div
      className={`${
        isFromUser() ? 'place-self-end' : 'place-self-start'
      } space-y-2`}
    >
      <div
        className={`p-5 rounded-2xl ${
          isFromUser()
            ? 'rounded-tr-none bg-blue-500'
            : 'rounded-tl-none bg-white'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default Message