import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import Chat from './Chat';
import Card from './Card';

const HaggleView = ({ state }) => {
  const location = useLocation(null);
  const [loading, setLoading] = useState(true);
  const [yourInfo, setYourInfo] = useState(null);
  const [theirInfo, setTheirInfo] = useState(null);
  const user = supabase.auth.user();
  const { swap = '' } = location.state || {};

  let theirObj;
  let yourObj;
  if (swap.outbound_id !== user.id) {
    theirObj = [swap.outbound_id, swap.outbound_offer];
    yourObj = [swap.inbound_offer];
  } else {
    theirObj = [swap.inbound_id, swap.inbound_offer];
    yourObj = [swap.outbound_offer];
  }
  console.log(theirObj);

  //1st id, second offer obj, thirdAvatarUrl

  useEffect(() => {
    const you = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl
          `
          )
          .eq('id', user.id);
        setYourInfo([user.id, ...yourObj, ...data]);
      } catch (error) {
        console.error(error);
      }
    };
    you();
  }, []);

  console.log('yourinfo', yourInfo);

  useEffect(() => {
    const them = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl
          
          `
          )
          .eq('id', theirObj[0]);
        // setTheirInfo(...data);
        setTheirInfo([...theirObj, ...data]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    them();
  }, []);


 

  //  console.log('other guy', theirInfo);
  //  console.log('you', yourInfo.avatarUrl)

  return loading ? (
    <div>Loading....</div>
  ) : (
    <div className="grid grid-cols-3 px-10 justify-items-center gap-10 mt-36">
      <div className="realtive justify-center">
        <div>you </div>
        <div className="w-6/12 sm:w-2/12 px-4 grid place-items-center">
          <img
            src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png"
            // src={yourInfo.avatarUrl}
            alt="..."
            className="shadow rounded-full w-full  align-middle border-none ml-52"
          />
          <button
            type="button"
            className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full w-full ml-52"
          >
            Inventory
          </button>
        </div>
        <div className="bg-red-300 w-full grid grid-rows-1 justify-center pt-5">
          <Card id={swap.inbound_offer.id} />
          <div>nkfjsd</div>
          <div>nkfjsd</div>
        </div>
      </div>

      <div className="relative">
        <Chat />
      </div>

      <div className="realtive justify-center">
        <div className="w-6/12 sm:w-2/12 px-4 grid place-items-center">
          <img
            src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png"
            // src={theirInfo.avatarUrl}

            alt="..."
            className="shadow rounded-full w-full border-none ml-52"
          />
          <button
            type="button"
            className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full w-full ml-52"
          >
            Inventory
          </button>
        </div>
        <div className="bg-red-300 h-screen w-full">
          <Card
            imageUrl={swap.outbound_offer.image_url}
            id={swap.outbound_offer.id}
            name={swap.outbound_offer.name}
          />
          <div>nkfjsd</div>
          <div>nkfjsd</div>
        </div>
      </div>
      {/* <div className="flex flex-wrap justify-center">
        <div className="w-6/12 sm:w-2/12 px-4 rounded-full">
          <img
            src={yourInfo.avatarUrl}
            //"https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
            alt="..."
            className="shadow rounded-full max-w-full h-auto align-middle border-none"
          />
          </div>
      </div> */}
    </div>
  );
};

export default HaggleView;

// <div className="flex flex-cols-2 bg-blue-300 h-max"></div>
//         </div>
// {/*
//   <div>
//     <div className="rounded overflow-hidden shadow-lg">
//       <div>Owner Item </div>
//       <Card
//         id={swap.inbound_offer.id}
//         imageUrl={swap.inbound_offer.image_url}
//       />
//     </div>
//     <div className="rounded overflow-hidden shadow-lg">
//       <div>Haggler Item</div>
//       <Card
//         id={swap.outbound_offer.id}
//         imageUrl={swap.outbound_offer.image_url}
//       />
//     </div>
//   </div>
//   <div className="haggleChat">Chat</div>
//   <Chat /> */}

//   <div className="HaggleprofileViews">Profiles</div>
//   <div className="flex flex-wrap justify-center">
//      <div className="w-6/12 sm:w-4/12 px-4">
// <img src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png" alt="..." className="shadow rounded-full max-w-full h-auto align-middle border-none" />
// </div>
// </div>

//     <div className="flex flex-wrap justify-center">
//       <div className="w-6/12 sm:w-2/12 px-4 rounded-full">
//         <img
//           src={yourInfo.avatarUrl}
//           //"https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
//           alt="..."
//           className="shadow rounded-full max-w-full h-auto align-middle border-none"
//         />
//       </div>
//     </div>
//     {/* <div className="w-6/12 sm:w-2/12 px-4">
//       <img
//         src={yourInfo.avatarUrl}
//         //"https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png"
//         alt="..."
//         className="shadow-lg rounded-full max-w-full h-auto align-middle border-none"
//       />
//     </div> */}
//   </div>
