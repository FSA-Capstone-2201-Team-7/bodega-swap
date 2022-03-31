import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import Chat from './Chat';
import Card from './Card';
import HaggleInventory from './HaggleInventory';

const HaggleView = ({ state }) => {
  const location = useLocation(null);
  const { swap = '' } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [userObj, setUserObj] = useState({});
  const [userItem, setUserItem] = useState({});
  const [userAccept, setUserAccept] = useState({});
  const [notUserId, setNotUserId] = useState('');
  const [traderObj, setTraderObj] = useState({});
  const [traderItem, setTraderItem] = useState({});
  const [traderAccept, setTraderAccept] = useState({});

  const [inventory, setInventory] = useState('');
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl,
          username,
          id
          `
          )
          .eq('id', user.id);
        setUserObj(...data);
        if (swap.outbound_id === user.id) {
          setUserItem({ ...swap.outbound_offer });
          setNotUserId(swap.inbound_id);
          setTraderItem({ ...swap.inbound_offer });
          setUserAccept({
            userAccept: swap.outbound_accept,
            inOrOut: 'outbound',
          });
          setTraderAccept({
            userAccept: swap.inbound_accept,
            inOrOut: 'inbound',
          });
          supabase
            .from('swaps')
            .on('UPDATE', (button) => {
              setUserAccept({
                userAccept: button.new.outbound_accept,
                inOrOut: 'outbound',
              });
              console.log('updated', button.new);
            })
            .subscribe();
        }
        if (swap.inbound_id === user.id) {
          setUserItem({ ...swap.inbound_offer });
          setNotUserId(swap.outbound_id);
          setTraderItem({ ...swap.outbound_offer });
          setUserAccept({
            userAccept: swap.inbound_accept,
            inOrOut: 'inbound',
          });
          setTraderAccept({
            userAccept: swap.outbound_accept,
            inOrOut: 'outbound',
          });
          supabase
            .from('swaps')
            .on('UPDATE', (button) => {
              setUserAccept({
                userAccept: button.new.inbound_accept,
                inOrOut: 'inbound',
              });
              console.log('updated', button.new);
            })
            .subscribe();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    userInfo();
  }, [
    swap.outbound_offer,
    swap.inbound_offer,
    swap.outbound_id,
    swap.inbound_id,
    user.id,
    swap.inbound_accept,
    swap.outbound_accept,
  ]);

  useEffect(() => {
    const trader = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl,
          username,
          id

          `
          )
          .eq('id', notUserId);
        setTraderObj(...data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    trader();
  }, [notUserId]);
  // final settlement between users are set when both agree
  // the database is updated from 'active' to 'processing?'
  //this is completed when both users hand off the trade
  // another method here may be to set it as complete and render a time
  //limit for both the exchange items or repurcussion on there reputation status may happen
  useEffect(() => {
    const setAgreement = async () => {
      try {
        if (swap.inbound_accept && swap.outbound_accept) {
          await supabase
            .from('swaps')
            .update({
              status: 'agreed',
            })
            .eq('id', swap.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setAgreement();
  }, [swap.id, swap.outbound_accept, swap.inbound_accept]);

  const handleAcceptance = async (check) => {
    try {
      console.log(check);
      if (check.inOrOut === 'inbound') {
        await supabase
          .from('swaps')
          .update({
            inbound_accept: true,
          })
          .eq('id', swap.id);

        setUserAccept({
          userAccept: swap.inbound_accept,
          inOrOut: 'inbound',
        });
        setTraderAccept({
          userAccept: swap.outbound_accept,
          inOrOut: 'outbound',
        });
      }

      if (check.inOrOut === 'outbound') {
        await supabase
          .from('swaps')
          .update({
            outbound_accept: true,
          })
          .eq('id', swap.id);
        setUserAccept({
          userAccept: swap.outbound_accept,
          inOrOut: 'outbound',
        });
        setTraderAccept({
          userAccept: swap.inbound_accept,
          inOrOut: 'inbound',
        });
      }

      setTraderAccept(traderAccept);
      setUserAccept(userAccept);
    } catch (error) {
      console.error(error);
    }
  };
    const handleConfimation = async (check) => {
      try {
        if (check === "inbound") {
          await supabase
            .from("swaps")
            .update({
              inbound_confirm: true,
            })
            .eq("id", swap.id);
        } else {
          await supabase
            .from("swaps")
            .update({
              outbound_confirm: true,
            })
            .eq("id", swap.id);
        }
      } catch (error) {
        console.error(error);
      }
      navigate("/messages", { state: { swap } });
    };
//testing 
  // console.log('userObj', userObj);
  // console.log('useraccept', userAccept.inOrOut);
  // console.log('userItem', userItem);
  // console.log('TraderObj', traderObj);
  // console.log('Traderaccept', traderAccept);
  // console.log('TraderItem', traderItem);
  // console.log('status, ', swap.status);

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="grid grid-cols-3 px-10 justify-items-center gap-10 mt-20">
      <div className="realtive justify-center">
        <div>
          <input type="checkbox" id="my-modal-5" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <div>
                <h3 className="font-bold text-lg">
                  Congratulations both trader's have come to an agreement!
                </h3>
                <p className="py-4">
                  By clicking confirm you both have met eachother at the argreed
                  upon location and have swapped the agreed upon items. until
                  both have submitted confirmation this swap will be live and
                  regarded as pending on your reputation.
                </p>
                <div className="modal-action">
                  <label
                    htmlFor="my-modal-5"
                    className="btn"
                    onClick={() => handleConfimation(userAccept.inOrOut)}
                  >
                    Confirm!
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 grid justify-center">
          <img
            src={traderObj.avatarUrl}
            alt="..."
            className="shadow h-48 w-48 rounded-full"
          />
        </div>
        <div className="drawer h-96">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content ">
            <div className="flex grid grid-cols-2">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button "
                onClick={() => setInventory(traderObj.inOrOut)}
              >
                Open Inventory
              </label>
              <button
                className="btn btn-xs sm:btn-sm md:btn-md w-full text-black"
                disabled="disabled"
              >
                Accept Terms
              </button>
            </div>
            <div className="bg-indigo-300 w-full grid grid-rows-1 justify-center">
              <Card
                id={traderItem.id}
                imageUrl={traderItem.image_url}
                className="pb=12"
              />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto  bg-base-100 text-base-content mr-12">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory('')}
              >
                Close Inventory
              </label>
              <HaggleInventory user={notUserId} />
            </ul>
          </div>
        </div>
      </div>

      <Chat
        MyUserName={userObj.username}
        TheirUserName={traderObj.username}
        MyAvatarUrl={userObj.avatarUrl}
        TheirAvatarUrl={traderObj.avatarUrl}
        receiver={traderObj.id}
        sender={userObj.id}
        swap={swap}
      />

      <div className="realtive justify-center">
        <div className="px-4 grid justify-center">
          <img
            src={userObj.avatarUrl}
            alt="..."
            className="shadow h-48 w-48 rounded-full border-none"
          />
        </div>
        <div className="drawer drawer-end h-96">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="flex grid grid-cols-2">
              {userAccept.userAccept ? (
                traderAccept.userAccept ? (
                  <label
                    htmlFor="my-modal-5"
                    className="btn modal-button w-full"
                  >
                    Mark Complete
                  </label>
                ) : (
                  <button className="btn loading">Waiting...</button>
                )
              ) : (
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md w-full"
                  onClick={() => handleAcceptance(userAccept)}
                >
                  Accept Terms
                </button>
              )}
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory(userObj.inOrOut)}
              >
                Open Inventory
              </label>
            </div>
            <div className="bg-gray-100 w-full grid grid-rows-1 justify-center">
              <Card id={userItem.id} imageUrl={userItem.image_url} />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content ml-12">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory('')}
              >
                Close Inventory
              </label>
              <HaggleInventory user={userObj.id} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaggleView;


// import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import { useLocation, useNavigate } from "react-router-dom";
// import Chat from "./Chat";
// import Card from "./Card";
// import HaggleInventory from "./HaggleInventory";
// import LoadingPage from "./LoadingPage";

// const HaggleView = ({ state }) => {
//   const location = useLocation(null);
//   const { swap = "" } = location.state || {};
//   const [thisSwap, setThisSwap] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [yourInfo, setYourInfo] = useState({});
//   const [theirInfo, setTheirInfo] = useState({});
//   const [notUserId, setNotUserId] = useState("");
//   const [inventory, setInventory] = useState("");
//   const user = supabase.auth.user();
//   const navigate = useNavigate();

//   //here we get the users info and avatar and spread them into new object to render into haggle view
//   useEffect(() => {
//     const you = async () => {
//       try {
//         setLoading(true);
//         const { data } = await supabase
//           .from("users")
//           .select(
//             `
//           avatarUrl,
//           username
//           `
//           )
//           .eq("id", user.id);
//         if (swap.outbound_id !== user.id) {
//           setYourInfo({
//             ...swap.outbound_offer,
//             ...data[0],
//             ...data[1],
//             userAccept: swap.outbound_accept,
//             inOrOut: "outbound",
//           });
//           supabase
//             .from("swaps")
//             .on("UPDATE", (update) => {
//               setYourInfo({
//                 ...swap.outbound_offer,
//                 ...data[0],
//                 ...data[1],
//                 userAccept: update.new.outbound_accept,
//                 inOrOut: "outbound",
//               });
//             })
//             .subscribe();
//           setNotUserId(swap.outbound_id);
//         } else {
//           setYourInfo({
//             ...swap.inbound_offer,
//             ...data[0],
//             ...data[1],
//             userAccept: swap.inbound_accept,
//             inOrOut: "inbound",
//           });
//           supabase
//             .from("swaps")
//             .on("UPDATE", (update) => {
//               setYourInfo({
//                 ...swap.outbound_offer,
//                 ...data[0],
//                 ...data[1],
//                 userAccept: update.new.inbound_accept,
//                 inOrOut: "inbound",
//               });
//             })
//             .subscribe();
//           setNotUserId(swap.inbound_id);
//         }
//         setThisSwap(swap);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     you();
//   }, [
//     swap.outbound_id,
//     swap.inbound_id,
//     swap.inbound_offer,
//     swap.outbound_offer,
//     user.id,
//     swap.inbound_accept,
//     swap.outbound_accept,
//     swap,
//   ]);

//   //here we grab the non-users infor and do the same thing
//   useEffect(() => {
//     const them = async () => {
//       try {
//         setLoading(true);
//         const { data } = await supabase
//           .from("users")
//           .select(
//             `
//           avatarUrl,
//           username

//           `
//           )
//           .eq("id", notUserId);

//         if (swap.outbound_id !== user.id) {
//           setTheirInfo({
//             ...swap.inbound_offer,
//             ...data[0],
//             ...data[1],
//             userAccept: swap.inbound_accept,
//             userConfirm: swap.inbound_confirm,
//             inOrOut: "inbound",
//           });
//            supabase
//              .from('swaps')
//              .on('UPDATE', (update) => {
//                setTheirInfo({
//                  ...swap.outbound_offer,
//                  ...data[0],
//                  ...data[1],
//                  userAccept: update.new.inbound_accept,
//                  inOrOut: 'inbound',
//                });
//              })
//              .subscribe();

//         } else {
//           setTheirInfo({
//             ...swap.outbound_offer,
//             ...data[0],
//             ...data[1],
//             userAccept: swap.outbound_accept,
//             userConfirm: swap.outbound_confirm,
//             inOrOut: "outbound",
//           });
//           supabase
//             .from('swaps')
//             .on('UPDATE', (update) => {
//               setTheirInfo({
//                 ...swap.outbound_offer,
//                 ...data[0],
//                 ...data[1],
//                 userAccept: update.new.outbound_accept,
//                 inOrOut: 'outbound',
//               });
//             })
//             .subscribe();
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     them();
//   }, [
//     notUserId,
//     swap.inbound_offer,
//     swap.outbound_id,
//     swap.outbound_offer,
//     user.id,
//     swap.inbound_accept,
//     swap.outbound_accept,
//     swap.inbound_confirm,
//     swap.outbound_confirm,
//   ]);

//   // final settlement between users are set when both agree
//   // the database is updated from 'active' to 'processing?'
//   //this is completed when both users hand off the trade
//   // another method here may be to set it as complete and render a time
//   //limit for both the exchange items or repurcussion on there reputation status may happen
//   useEffect(() => {
//     const setAgreement = async () => {
//       try {
//         if (swap.inbound_accept && swap.outbound_accept) {
//           await supabase
//             .from("swaps")
//             .update({
//               status: "agreed",
//             })
//             .eq("id", swap.id);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     setAgreement();
//   }, [swap.id, swap.outbound_accept, swap.inbound_accept]);

//   //still working on this for realtime purposes
//   const handleAcceptance = async (check) => {

//     try {
//       if (check.inOrOut === 'inbound') {
//         await supabase
//           .from('swaps')
//           .update({
//             inbound_accept: true,
//           })
//           .eq('id', swap.id);
//         // setYourInfo([...yourInfo, { userAccept: true }]);
//         // setTheirInfo([...theirInfo]);
//       }

//       if (check.inOrOut === 'outbound') {
//         await supabase
//           .from('swaps')
//           .update({
//             outbound_accept: true,
//           })
//           .eq('id', swap.id);

//       }
//         setYourInfo(...yourInfo);
//         setTheirInfo(...theirInfo);

//       supabase
//         .from('swaps')
//         .on('UPDATE', (button) => {
//           setThisSwap(button.new);
//           console.log('updated', button.new);
//           setYourInfo(...yourInfo)
//           setTheirInfo(...theirInfo);
//         })
//         .subscribe();

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleConfimation = async (check) => {
//     try {
//       if (check === "inbound") {
//         await supabase
//           .from("swaps")
//           .update({
//             inbound_confirm: true,
//           })
//           .eq("id", swap.id);
//       } else {
//         await supabase
//           .from("swaps")
//           .update({
//             outbound_confirm: true,
//           })
//           .eq("id", swap.id);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//     navigate("/messages", { state: { swap } });
//   };

//   return loading ? (
//     <LoadingPage />
//   ) : (
//     <div className="grid grid-cols-3 px-10 justify-items-center gap-10 mt-20">
//       <div className="realtive justify-center">
// <div>
// <input type="checkbox" id="my-modal-5" className="modal-toggle" />
// <div className="modal">
//   <div className="modal-box w-11/12 max-w-5xl">
//     <div>
//       <h3 className="font-bold text-lg">
//         Congratulations both trader's have come to an agreement!
//       </h3>
//       <p className="py-4">
//         By clicking confirm you both have met eachother at the argreed
//         upon location and have swapped the agreed upon items. until
//         both have submitted confirmation this swap will be live and
//         regarded as pending on your reputation.
//       </p>
//       <div className="modal-action">
//         <label
//           htmlFor="my-modal-5"
//           className="btn"
//           onClick={() => handleConfimation(yourInfo.inOrOut)}
//         >
//           Confirm!
//         </label>
//       </div>
//     </div>
//     </div>
//           </div>
//         </div>
//         <div className="px-4 grid justify-center">
//           <img
//             src={yourInfo.avatarUrl}
//             alt="..."
//             className="shadow h-48 w-48 rounded-full"
//           />
//         </div>
//         <div className="drawer h-96">
//           <input id="my-drawer" type="checkbox" className="drawer-toggle" />
//           <div className="drawer-content ">
//             <div className="flex grid grid-cols-2">
//               <label
//                 htmlFor="my-drawer"
//                 className="btn btn-primary drawer-button "
//                 onClick={() => setInventory(yourInfo.inOrOut)}
//               >
//                 Open Inventory
//               </label>
//               {yourInfo.userAccept ? (
//                 swap.status === 'agreed' ? (
//                   <label
//                     htmlFor="my-modal-5"
//                     className="btn modal-button w-full"
//                   >
//                     Mark Complete
//                   </label>
//                 ) : (
//                   <button className="btn loading">Waiting...</button>
//                 )
//               ) : (
//                 <button
//                   className="btn btn-xs sm:btn-sm md:btn-md w-full"
//                   onClick={() => handleAcceptance(yourInfo)}
//                 >
//                   Accept Terms
//                 </button>
//               )}
//             </div>
//             <div className="bg-indigo-300 w-full grid grid-rows-1 justify-center">
//               <Card id={yourInfo.id} imageUrl={yourInfo.image_url} className="pb=12 "/>
//             </div>
//           </div>
//           <div className="drawer-side">
//             <label htmlFor="my-drawer" className="drawer-overlay"></label>

//             <ul className="menu p-4 overflow-y-auto w-full md:w-auto  bg-base-100 text-base-content mr-12">
//               <label
//                 htmlFor="my-drawer"
//                 className="btn btn-primary drawer-button"
//                 onClick={() => setInventory('')}
//               >
//                 Close Inventory
//               </label>
//               <HaggleInventory user={user.id} />
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div className="relative">
//         <Chat
//           MyUserName={yourInfo.username}
//           TheirUserName={theirInfo.username}
//           MyAvatarUrl={yourInfo.avatarUrl}
//           TheirAvatarUrl={theirInfo.avatarUrl}
//           receiver={notUserId}
//           sender={user.id}
//           swap={swap}
//         />
//       </div>
//       <div className="realtive justify-center">
//         <div className="px-4 grid justify-center">
//           <img
//             src={theirInfo.avatarUrl}
//             alt="..."
//             className="shadow h-48 w-48 rounded-full border-none"
//           />
//         </div>
//         <div className="drawer drawer-end h-96">
//           <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//           <div className="drawer-content">
//             <div className="flex grid grid-cols-2">
//               <button
//                 className="btn btn-xs sm:btn-sm md:btn-md w-full text-black"
//                 disabled="disabled"
//               >
//                 Accept Terms
//               </button>
//               <label
//                 htmlFor="my-drawer-4"
//                 className="btn btn-primary drawer-button"
//                 onClick={() => setInventory(theirInfo.inOrOut)}
//               >
//                 Open Inventory
//               </label>
//             </div>
//             <div className="bg-gray-100 w-full grid grid-rows-1 justify-center">
//               <Card id={theirInfo.id} imageUrl={theirInfo.image_url} />
//             </div>
//           </div>
//           <div className="drawer-side">
//             <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

//             <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content ml-12">
//               <label
//                 htmlFor="my-drawer-4"
//                 className="btn btn-primary drawer-button"
//                 onClick={() => setInventory('')}
//               >
//                 Close Inventory
//               </label>
//               <HaggleInventory user={notUserId} />
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HaggleView;