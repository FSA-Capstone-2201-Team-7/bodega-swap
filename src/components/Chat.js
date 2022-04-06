import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message";
import LoadingPage from "./LoadingPage";
const Chat = (props) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState({});
  const [input, setInput] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { TheirAvatarUrl, MyAvatarUrl, MyUserName, TheirUserName } = props;

  useEffect(() => {
    init()
  }, []);

  const init = async () => {
    const conversation = await getConversation();
    await getMessages(conversation);
    const subscription = createMessagesSubscription();
    setLoading(false)
    return () => {
      supabase.removeSubscription(subscription)
    }
  }

  const getConversation = async () => {
    try {

      const { data } = await supabase
        .from('conversations')
        .select()
        .eq('swap_Id', props.swap.id);

      setConversation(data[0]);
      return data[0]
    } catch (error) {
      console.error(error);
    }
  };

  const getMessages = async (conversationData) => {
    const { data } = await supabase
      .from('messages')
      .select()
      .eq('conversations_Id', conversationData.id);
    setMessages(data);
  }

  const createMessagesSubscription = () => {
    return supabase
      .from('messages')
      .on('INSERT', (message) => {
        setNewMessage(message.new);
        setMessages((currMessages) => {
          return [...currMessages, message.new]
        });
      })
      .subscribe();
  }




  useEffect(() => {
    const scrollToBottom = () => {
      if (newMessage && conversation) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      setNewMessage('');
    };
    scrollToBottom();
  }, [newMessage, conversation]);

  const createMessage = async (e) => {
    e.preventDefault();
    try {
      if (input) {
        await supabase.from("messages").insert([
          {
            content: input,
            sender_Id: props.sender,
            conversations_Id: conversation.id,
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
    <div className="container  bg-base-100 border rounded col-span-3 lg:col-span-1">
      <div className="relative flex items-center justify-between p-3 border-b border-gray-300 gap-x-4 ">
        <div className="flex gap-2 items-center">
          <img src={TheirAvatarUrl} alt="" className="h-8 w-8 rounded-full" />
          <p className="font-semibold">{TheirUserName}</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="text-gray-600">online</div>
          <span className="w-3 h-3 bg-green-600 rounded-full text-white "></span>
        </div>
      </div>
      <div className="p:2 sm:p-6 h-96 justify-between bg-base-100 max-w-2xl rounded overflow-auto">
        {messages ? (
          <InfiniteScroll id="chat" dataLength={messages.length}>
            <div className="justify-items-center pt-5">
              <ul className="space-y-12 grid grid-cols-1">
                {messages &&
                  messages?.map((message, i) => {
                    return (
                      <Message
                        key={message.id}
                        TheirAvatarUrl={TheirAvatarUrl}
                        MyAvatarUrl={MyAvatarUrl}
                        message={message}
                      />
                    );
                  })}
              </ul>
            </div>
            <div ref={messagesEndRef} />
          </InfiniteScroll>
        ) : (
          <div>Loading....</div>
        )}
      </div>

      <div className="pb-5 gap-2 justify-center items-center flex bg-base-100 w-full">
        <form onSubmit={createMessage} className="w-full">
          <input
            type="text"
            value={input}
            placeholder="Type here..."
            onChange={handleChange}
            className="input input-ghost ml-2 w-[95%] "
          />
        </form>
        <button type="submit" className="btn btn-active btn-ghost btn-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
