import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import InfiniteScroll from 'react-infinite-scroll-component';
import Message from './Message';

const Chat = (props) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversation] = useState([]);
  const [input, setInput] = useState('');
  

  useEffect(() => {
    const getConversation = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('conversations')
          .select(`id`)
          .eq('sender_Id', props.sender)
          .eq('receiver_Id', props.receiver);
        if (data) {
          setConversation(...data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getConversation();
  }, [props.sender, props.receiver]);


  //here we implement realtime by applying any change made with messages 
  //to the database to be seen in realtime with .on() .subscribe()
  useEffect(() => {
    const getUserMessages = async () => {
      try {
        const { data } = await supabase
          .from('messages')
          .select()
          .eq('conversations_ID', conversationId.id);

           setMessages(data);
        if (data) {
          supabase
            .from('messages')
            .on('INSERT', (message) => {
              setMessages([...messages, message.new]);
              console.log('message received!', message.new);
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


  const createMessage = async (e) => {
    console.log('event? ', e)
    try {
      if (input) {
        await supabase.from('messages').insert([
          {
            content: input,
            sender_Id: props.sender,
            conversations_ID: conversationId.id,
          },
        ]);

        setInput('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //will be used to develop infinite scroll properties
  // const fetchMessages = () => {
  //   if(messages) {
  //     return messages
  //   }
  // }

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  return loading ? (
    <div>Loading....</div>
  ) : (
    <div className="container bg-base-100 border rounded ">
      <div className="w-96 mr-5 ml-5 pb-5 pt-5">
        <div className="relative flex items-centerp-3 border-b border-gray-300">
          <span className="absolute w-3 h-3 bg-green-600 rounded-full right-14 top-3 text-white">
            {' '}
          </span>
          <div>online?</div>
        </div>
      </div>
      <div className="p:2 sm:p-6 justify-between h-screen bg-base-100 max-w-2xl rounded overflow-auto">
        {messages ? (
          <InfiniteScroll dataLength={messages.length} loader={<h4>...</h4>}>
            <div className="justify-items-center pt-5">
              <ul className="space-y-12 grid grid-cols-1">
                {messages &&
                  messages?.map((message, i) => {
                    return <Message key={message.id} message={message} />;
                  })}
              </ul>
            </div>
          </InfiniteScroll>
        ) : (
          <div>Loading....</div>
        )}
      </div>
      <div className="pb-5 pt-5 justify-center flex bg-base-100 w-full">
        <input
          type="text"
          value={input}
          placeholder="Type here"
          onChange={handleChange}
          className="input input-ghost input-lg w-full max-w-xs"
        />
      
        <button
          type="click"
          className="btn btn-active btn-ghost btn-lg"
          onClick={() => createMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;


