import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Message from './Message';

const Chat = (props) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const [realtimeMessage, setRealTime] = useState([]);
  const user = supabase.auth.user();

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


  const createMessage = async () => {
    try {
      if (input) {
        const { data } = await supabase.from('messages').insert([
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


  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  return loading ? (
    <div>Loading....</div>
  ) : (
    <div className="container ">
      <div className="p:2 sm:p-6 justify-between h-screen bg-base-100 max-w-2xl border rounded">
        <div className="w-96 mr-5 ml-5">
          <div className="relative flex items-center p-3 border-b border-gray-300">
            <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
          </div>
        </div>
        <div className="justify-items-center pt-5">
          <ul className="space-y-12 grid grid-cols-1">
            {messages &&
              messages?.map((message, i) => {

                return <Message key={message.id} message={message} />;
              })}
          </ul>
        </div>
      </div>
      <div className="justify-center flex bg-base-100 w-full">
        <input
          type="text"
          value={input}
          placeholder="Type here"
          onChange={handleChange}
          className="input input-ghost w-full max-w-xs"
        />
        <button
          type="button"
          className="btn btn-active btn-ghost"
          onClick={() => createMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;


