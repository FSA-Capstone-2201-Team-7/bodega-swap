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
        setYourInfo(...data);
      } catch (error) {
        console.error(error);
      }
    };
    you();
  }, [user.id]);

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
          .eq('id', swap.inbound_id);
        setTheirInfo(...data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    them();
  }, [swap]);

  //  console.log('other guy', theirInfo);
  //  console.log('you', yourInfo.avatarUrl)

  return loading ? (
    <div>Loading....</div>
  ) : (
    <div className=" flex flex-cols-2 mt-[2%]">
      <div className="flex flex-wrap justify-center">
        <div className="w-6/12 sm:w-2/12 px-4 grid place-items-center">
          <img
            src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png"
            alt="..."
            className="shadow rounded-full max-w-full h-auto align-middle border-none"
          />
          <div className="flex bg-red-300 h-screen ">dlnaf</div>
        </div>
      </div>
      <Chat />
      <div className="flex flex-wrap justify-center">
        <div className="w-6/12 sm:w-2/12 px-4 rounded-full grid place-items-center">
          <img
            src={yourInfo.avatarUrl}
            //"https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
            alt="..."
            className="shadow rounded-full max-w-full h-auto align-middle border-none"
          />
          <div className="flex bg-blue-300 h-screen">njfskad</div>
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