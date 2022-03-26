import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversation] = useState('');
  const [newMessage, setNewMessage] = useState(null);
  const [input, setInput] = useState('') 
  const user = supabase.auth.user();

  // const { sender, receiver } = props;
  //   console.log('sender, ', props.sender);
  //   // console.log('reciver meeee', receiver);
  // console.log(props)

  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await supabase
          .from('conversations')
          .select(`id`)
          .eq('sender_Id', props.sender)
          .eq('receiver_Id', props.receiver);
        setConversation(...data);
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
      } catch (error) {
        console.error(error);
      }
    };
    getUserMessages();
  }, [conversationId]);

  // useEffect(() => {
  //   const createMessage = async () => {
  //     try {
  //       await supabase
  //         .from('messages')
  //         .insert([
  //           { 
  //             content: newMessage, 
  //             sender_Id: props.sender, 
  //             conversations_ID: conversationId.id
  //           }
  //         ])
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  // }, []);
  
   const createMessage = async () => {
      try {
        if(input) {
       const {data} = await supabase
          .from('messages')
          .insert([
            { 
              content: input, 
              sender_Id: props.sender, 
              conversations_ID: conversationId.id
            }
          ])
          console.log(data)
          setInput('')
        }
      } catch (error) {
        console.error(error);
      }
    }

   
  const handleChange = (e) => {
    const {value} = e.target
    console.log(value)
    setInput(value)

  }

  return (
    // <div className="p:2 sm:p-6 justify-between h-screen bg-base-100 container w-2xl">
    <div className="grid grid-cols-1 px-10 justify-items-center gap-10 mt-96">
      <div className="bg-base-100 w-full grid grid-rows-1 justify-center">
        {/* {messages.map((el) => {
          return <div>{el.content}</div>;
        })} */}
        {/* <div className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
      djkad
      </div> */}
        <div className="justify-center mt-4 flex">
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
    </div>
  );
};

export default Chat;

//f90aa699-5105-4fec-a8b9-82796c0e2158
//5409317d-20d1-4707-9043-d091d719296d

//import React from 'react';

// const style = {
//    journal-scroll::-webkit-scrollbar: {
//         width: 6px;
//         cursor: pointer;
//     }

//     #journal-scroll::-webkit-scrollbar-track {
//         background-color: rgba(229, 231, 235, var(--bg-opacity));
//         cursor: pointer;
//     }

//     #journal-scroll::-webkit-scrollbar-thumb {
//         cursor: pointer;
//         background-color: #a0aec0;
//     }
// }

// const Chat = () => {
//   return (
//     <div className=" w-full lg:max-w-full lg:flex">
//       <div className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
//         djkad
//       </div>
//       <div class="border-r border-b border-l border-r border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
//         <div class="mb-8">
//           <p class="text-gray-700 text-base">
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//             Voluptatibus quia, Nonea! Maiores et perferendis eaque,
//             exercitationem praesentium nihil.
//           </p>
//         </div>
//       </div>
//       {/* <div class=" w-full lg:max-w-full lg:flex">
//           <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style="background-image: url('/mountain.jpg')" title="Mountain">

//           </div>
//                 <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"></div>
//   <div class="mb-8">
//      <p class="text-sm text-gray-600 flex items-center">
//                    <svg class="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                                    <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
//                    </svg>
//                    Membersonly
//      </p>
//   </div>
//   </div> */}
//     </div>
//   );
// };

// export default Chat;

// <div className="bg-gray-300 h-screen flex justify-center rounded shadow-2xl">
//   <div className=" flex justify-center grid grid-cols-1 ">
//     <div className="w-96 bg-white rounded shadow-2xl">
//       <nav className=" h-10 bg-gray-900 rounded-tr rounded-tl flex justify-between items-center">
//         <div className="flex justify-center items-center">
//           {' '}
//           <span className="text-xl font-medium text-gray-300 ml-1">
//             USERNAMES?
//           </span>{' '}
//         </div>
//       </nav>
//       <div className="overflow-auto px-1 py-1">messages here</div>
//     </div>
//     <div className="bg-white">
//       <div className="relative ">
//         <div className="absolute top-48 ">
//           <input
//             type="text"
//             className="rounded-full w-96 pl-12 pr12  py-8 focus:outline-none h-auto placeholder-gray-100 bg-gray-900 text-white"
//             placeholder="Type a message..."
//           />

//           <div className=" w-96 rounded-full bg-blue-300 text-center items-center flex justify-center focus:outline-none hover:bg-gray-900 hover:text-white ">
//             <button
//               className="rounded-full  text-center flex justify-center focus:outline-none hover:bg-gray-900 hover:text-white"
//               onClick={() => console.log('message send')}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-5">
//   <ul className="w-full lg:max-w-full lg:flex">
//     <li className="card">
//       <div className="cardBody">
//         <div className="row">
//           <div className="col-sm-2">
//             {/* <img src="" alt="">image will go here </img> */}
//             <p>Username</p>
//           </div>
//           <div className="col-10">
//             <p>
//               bhabfdakbdhfadhakbfakbfbbbbbbdhaliejlanldijljfaljldfndjncdjk
//               vkjvbkb kd vhkkdabkkdbkd djafk dka{' '}
//             </p>
//           </div>
//         </div>
//       </div>
//     </li>
//   </ul>
// </div>
