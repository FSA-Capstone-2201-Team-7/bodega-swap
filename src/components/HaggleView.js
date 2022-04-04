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
  const [userItem, setUserItem] = useState([]);
  const [userAccept, setUserAccept] = useState({});
  const [notUserId, setNotUserId] = useState('');
  const [traderObj, setTraderObj] = useState({});
  const [traderItem, setTraderItem] = useState([]);
  const [traderAccept, setTraderAccept] = useState({});
  const [swapHaggle, setSwap] = useState({});
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSwap = async () => {
      try {
        const { data } = await supabase
          .from('swaps')
          .select()
          .single()
          .eq('id', swap.id);

        setSwap(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSwap();
  }, [swap.id]);

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
        if (swapHaggle.outbound_id === user.id) {
          // setUserItem({ ...swapHaggle.outbound_offer });
          // setTraderItem({ ...swapHaggle.inbound_offer });

          setNotUserId(swapHaggle.inbound_id);
          setUserItem(swapHaggle.outbound_items);
          setTraderItem(swapHaggle.inbound_items);
          setUserAccept({
            userAccept: swapHaggle.outbound_accept,
            inOrOut: 'outbound',
          });
          setTraderAccept({
            userAccept: swapHaggle.inbound_accept,
            inOrOut: 'inbound',
          });
        }
        if (swapHaggle.inbound_id === user.id) {
          // setUserItem({ ...swapHaggle.inbound_offer });
          // setTraderItem({ ...swapHaggle.outbound_offer });

          setNotUserId(swapHaggle.outbound_id);
          setUserItem(swapHaggle.inbound_items);
          setTraderItem(swapHaggle.outbound_items);
          setUserAccept({
            userAccept: swapHaggle.inbound_accept,
            inOrOut: 'inbound',
          });
          setTraderAccept({
            userAccept: swapHaggle.outbound_accept,
            inOrOut: 'outbound',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    userInfo();
  }, [
    swapHaggle.outbound_offer,
    swapHaggle.inbound_offer,
    swapHaggle.outbound_id,
    swapHaggle.inbound_id,
    user.id,
    swapHaggle.inbound_accept,
    swapHaggle.outbound_accept,
    swapHaggle.outbound_items,
    swapHaggle.inbound_items,
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
        if (swapHaggle.inbound_accept && swapHaggle.outbound_accept) {
          await supabase
            .from('swaps')
            .update({
              status: 'agreed',
            })
            .eq('id', swapHaggle.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setAgreement();
  }, [swapHaggle.id, swapHaggle.outbound_accept, swapHaggle.inbound_accept]);

  const handleAcceptance = async (check) => {
    try {
      if (check.inOrOut === 'inbound') {
        await supabase
          .from('swaps')
          .update({
            inbound_accept: true,
          })
          .eq('id', swapHaggle.id);
      }

      if (check.inOrOut === 'outbound') {
        await supabase
          .from('swaps')
          .update({
            outbound_accept: true,
          })
          .eq('id', swapHaggle.id);
      }
    } catch (error) {
      console.error(error);
    }
  };
  supabase
    .from('swaps')
    .on('UPDATE', (button) => {
      setSwap(button.new);
    })
    .subscribe();

  const handleConfimation = async (check) => {
    try {
      if (check === 'inbound') {
        await supabase
          .from('swaps')
          .update({
            inbound_confirm: true,
          })
          .eq('id', swapHaggle.id);
      } else {
        await supabase
          .from('swaps')
          .update({
            outbound_confirm: true,
          })
          .eq('id', swapHaggle.id);
      }
    } catch (error) {
      console.error(error);
    }
    navigate('/messages', { state: { swap } });
  };

  //testing
  // console.log('userObj', userObj);
  //console.log('useraccept', userAccept);
  //console.log('userItem', userItem);
  //console.log('TraderObj', traderObj);
  //console.log('Traderaccept', traderAccept);
   //console.log('TraderItem', traderItem);
  // console.log('status, ', swap.status);
  //console.log('haggle', swapHaggle)
  // console.log(swap);

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="grid grid-cols-3 px-10 justify-items-center gap-10 mt-12">
      <div className="relative hidden lg:flex lg:flex-col  justify-center">
        <div>
          <input type="checkbox" id="my-modal-5" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <div>
                <h3 className="font-bold text-lg">
                  Congratulations! Both swappers have come to an agreement!
                </h3>
                <p className="py-4">
                  By clicking confirm you both have met each other at the agreed
                  upon location and have swapped the agreed upon items. In order
                  to get credit for a completed transaction, and for the item to
                  change hands, bot swappers must confirm that the swap has
                  taken place, and rate their swapmates.
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
        <div className="px-4 grid  justify-center">
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
              >
                See Other Items
              </label>
              <button
                className="btn btn-xs sm:btn-sm md:btn-md w-full text-black"
                disabled="disabled"
              >
                Accept Terms
              </button>
            </div>
            <div className="pt-5 pb-5 flex flex-wrap justify-center">
              {userItem.map((item) => {
                return (
                  <div key={item.id}>
                    <img
                      src={item.image_url}
                      alt=""
                      className="shadow h-48 w-48 mask mask-squircle"
                    />
                  </div>
                );
              })}
            </div>
            {/* <div className="bg-indigo-300 w-full grid grid-rows-1 justify-center">
            
              
              <Card 
                id={userItem.id}
                imageUrl={userItem.image_url}
                className=" shadow h-48 w-48 rounded-full"
              />
            </div> */}
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto  bg-base-100 text-base-content">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
              >
                Close
              </label>
              <HaggleInventory user={notUserId} />
            </ul>
          </div>
        </div>
      </div>

      {/* <div className="drawer drawer-end absolute h-96">
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="btn btn-primary drawer-button pr-3"
            onClick={() => setInventory(userObj.inOrOut)}
          >
            Menu
          </label>
        </div>
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side overflow-y-auto pl-96 ">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

          <ul className="menu absolute overflow-y-auto md:h-auto mb-56 h-96 bg-base-100 text-base-content  pl-24 pr-28 ">
            {userAccept.userAccept ? (
              traderAccept.userAccept ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-xs sm:btn-sm md:btn-md w-full"
                    onClick={() => handleConfimation(userAccept.inOrOut)}
                  >
                    Mark Complete
                  </button>
                  <div className=" h-20 card bg-base-300 rounded-box place-items-center text-lg font-semibold mt-3">
                    <p className="py-4">
                      By clicking confirm you both have met each other
                    </p>
                  </div>
                </div>
              ) : (
                <button className="btn loading">Waiting...</button>
              )
            ) : (
              <button
                className="btn btn-xs sm:btn-sm md:btn-md"
                onClick={() => handleAcceptance(userAccept)}
              >
                Accept Terms
              </button>
            )}
            <p className="text-xl font-semibold mb-4 mt-6">Current Trade</p>
            <div className="flex w-full">
              <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center text-xl font-semibold">
                {traderObj.username}
              </div>
              <div className="divider divider-horizontal">Swap</div>
              <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center text-xl font-semibold">
                Your Item
              </div>
            </div>

            <div className="flex grid grid-cols-2 pt-5">
              <div className="avatar">
                <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={userItem.image_url}
                    alt="..."
                    className="shadow h-48 w-48 rounded-full"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-48 rounded-full ring ring-primary ring-offset-base-500 ring-offset-2">
                  <img
                    src={traderItem.image_url}
                    alt="..."
                    className="shadow h-48 w-48 rounded-full"
                  />
                </div>
              </div>
            </div>
            <label className="swap swap-flip text-xl pt-10">
              <input type="checkbox" />

              <div className="swap-on">
                <div
                  type="button"
                  className="grid h-20 card bg-base-300 rounded-box place-items-center"
                >
                  Your Inventory
                </div>
                <HaggleInventory
                  user={userObj.id}
                  setItem={setTraderItem}
                  swap={swap}
                />
              </div>
              <div className="swap-off">
                <div className="grid h-20 card bg-base-300 rounded-box place-items-center ">
                  {traderObj.username} Inventory
                </div>
                <HaggleInventory user={traderObj.id} swap={swap} />
              </div>
            </label>
          
          </ul>
        </div>
      </div> */}

      <Chat
        MyUserName={userObj.username}
        TheirUserName={traderObj.username}
        MyAvatarUrl={userObj.avatarUrl}
        TheirAvatarUrl={traderObj.avatarUrl}
        receiver={traderObj.id}
        sender={userObj.id}
        swap={swap}
      />

      <div className="relative hidden lg:flex lg:flex-col lg:justify-center">
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
              >
                My Items
              </label>
            </div>
            <div className="pt-5 pb-5 flex flex-wrap justify-center">
              {traderItem.map((item) => {
                return (
                  <div key={item.id}>
                    <button className="btn btn-circle" onClick={() => console.log('this item', item)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <img
                      src={item.image_url}
                      alt=""
                      className="shadow h-48 w-48 mask mask-squircle relative"
                    />
                  </div>
                );
              })}
              mee
            </div>
            {/* <div className="bg-gray-100 w-full flex  justify-center">
              <Card id={traderItem.id} imageUrl={traderItem.image_url} />
            </div> */}
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
              >
                Close
              </label>
              <HaggleInventory
                user={userObj.id}
                setUserItem={setUserItem}
                setTraderItem={setTraderItem}
                swap={swap}
                inOrOut={userAccept.inOrOut}
                items={traderItem}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaggleView;
