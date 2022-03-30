import React from "react";
import { supabase } from "../supabaseClient";

const Message = ({ message, TheirAvatarUrl, MyAvatarUrl }) => {
  const user = supabase.auth.user();

  // here we check if a message is from a user or not then apply the logic into the outter
  // div to render the message to the appropriate side
  const isFromUser = () => {
    return user.id === message.sender_Id;
  };
  return (
    <div
      className={`${
        isFromUser()
          ? "place-self-end flex gap-2  flex-row-reverse items-center"
          : "place-self-start gap-2  flex items-center"
      } space-y-1`}
    >
      <div>
        {" "}
        {isFromUser() ? (
          <img className="h-7 w-7 rounded-full" src={MyAvatarUrl} alt="" />
        ) : (
          <img className="h-7 w-7 rounded-full" src={TheirAvatarUrl} alt="" />
        )}
      </div>
      <div
        className={`px-3 py-1 rounded-2xl flex ${
          isFromUser() ? " bg-indigo-500 text-white" : " bg-white shadow-lg"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default Message;
