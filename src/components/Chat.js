import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message";
import LoadingPage from "./LoadingPage";
const Chat = (props) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getConversation = async () => {
      try {
        setLoading(true);

        const { data } = await supabase
          .from("conversations")
          .select(`id`)
          .eq("sender_Id", props.sender)

          .eq("receiver_Id", props.receiver)
          .eq("swap_Id", props.swap.id);

        setConversation(...data);
        if (!data[0]) {
          const { data: reversed } = await supabase
            .from("conversations")
            .select(`id`)
            .eq("sender_Id", props.receiver)
            .eq("receiver_Id", props.sender)
            .eq("swap_Id", props.swap.id);

          setConversation(...reversed);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getConversation();
  }, [props.sender, props.receiver, props.swap.id]);

  //here we implement realtime by applying any change made with messages
  //to the database to be seen in realtime with .on() .subscribe()
  useEffect(() => {
    const getUserMessages = async () => {
      try {
        if (conversationId) {
          const { data } = await supabase
            .from("messages")
            .select()
            .eq("conversations_ID", conversationId.id);
          setMessages(data);

          supabase
            .from("messages")
            .on("INSERT", (message) => {
              setNewMessage(message.new);
              setMessages([...messages, message.new]);
            })
            .subscribe();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getUserMessages();
  }, [conversationId, messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (newMessage) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setNewMessage("");
    };
    scrollToBottom();
  }, [newMessage]);

  const createMessage = async (e) => {
    e.preventDefault();
    try {
      if (input) {
        await supabase.from("messages").insert([
          {
            content: input,
            sender_Id: props.sender,
            conversations_ID: conversationId.id,
          },
        ]);

        setInput("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="container bg-base-100 border rounded ">
      <div className="w-96 mr-5 ml-5 pb-5 pt-5">
        <div className="relative flex items-centerp-3 border-b border-gray-300">
          <span className="absolute w-3 h-3 bg-green-600 rounded-full right-14 top-3 text-white"></span>
          <div>online?</div>
        </div>
      </div>
      <div className="p:2 sm:p-6 justify-between h-screen bg-base-100 max-w-2xl rounded overflow-auto">
        {messages ? (
          <InfiniteScroll id="chat" dataLength={messages.length}>
            <div className="justify-items-center pt-5">
              <ul className="space-y-12 grid grid-cols-1">
                {messages &&
                  messages?.map((message, i) => {
                    return <Message key={message.id} message={message} />;
                  })}
              </ul>
            </div>
            <div ref={messagesEndRef} />
          </InfiniteScroll>
        ) : (
          <div>Loading....</div>
        )}
      </div>

      <div className="pb-5 pt-5 justify-center flex bg-base-100 w-full">
        <form onSubmit={createMessage}>
          <input
            type="text"
            value={input}
            placeholder="Type here"
            onChange={handleChange}
            className="input input-ghost input-lg w-full max-w-xs"
          />

          <button type="submit" className="btn btn-active btn-ghost btn-lg">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
