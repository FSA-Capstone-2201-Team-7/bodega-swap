import React, { useState, useEffect, Fragment } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import Chat from './Chat';
import HaggleInventory from './HaggleInventory';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

const HaggleView = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [userObj, setUserObj] = useState({});
  const [userItem, setUserItem] = useState([]);
  const [userAccept, setUserAccept] = useState({});
  const [notUserId, setNotUserId] = useState('');
  const [traderObj, setTraderObj] = useState({});
  const [traderItem, setTraderItem] = useState([]);
  const [traderAccept, setTraderAccept] = useState({});
  const [swapHaggle, setSwap] = useState({});
  const [open, setOpen] = useState(true);
  const user = supabase.auth.user();
  const navigate = useNavigate();
  const location = useLocation(null);
  const { swap = '' } = location.state || {};

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

  const handleRemove = async (item, allItems, inOrOut) => {
    try {
      console.log(inOrOut);
      const filtered = allItems.filter((keep) => {
        if (keep.id !== item.id) {
          return keep;
        }
      });

      if (filtered.length !== allItems.length && inOrOut === 'outbound') {
        const { data } = await supabase
          .from('swaps')
          .update({
            inbound_items: filtered,
          })
          .eq('id', swap.id);
        console.log(data);
        //setTraderItem;
      }
      if (filtered.length !== allItems.length && inOrOut === 'inbound') {
        const { data } = await supabase
          .from('swaps')
          .update({
            outbound_items: filtered,
          })
          .eq('id', swap.id);
        console.log(data);
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

      <Chat
        MyUserName={userObj.username}
        TheirUserName={traderObj.username}
        MyAvatarUrl={userObj.avatarUrl}
        TheirAvatarUrl={traderObj.avatarUrl}
        receiver={traderObj.id}
        sender={userObj.id}
        swap={swap}
      />
      <div className="">
        <button
          type="button"
          className="btn btn-primary drawer-button pr-5 pl-5 w-24"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
        {userAccept.userAccept ? (
          traderAccept.userAccept ? (
            <div>
              <button
                type="button"
                className="btn pr-5 pl-5 w-24"
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
            <button className="btn pr-5 pl-5 w-24 loading">Waiting...</button>
          )
        ) : (
          <button
            className="pr-5 pl-5 w-full btn "
            onClick={() => handleAcceptance(userAccept)}
          >
            Accept Terms
          </button>
        )}
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden ">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto relative w-screen max-w-md mt-20">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900 text-center font-semibold">
                        Current Trade
                      </Dialog.Title>
                    </div>
                    <div className="flex grid grid-cols-2 pt-5 pl-5 pr-5 ">
                      <div>
                        {userItem.map((item) => {
                          return (
                            <div className="avatar">
                              <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                  src={item.image_url}
                                  alt="..."
                                  className="shadow h-48 w-48 rounded-full"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        {traderItem.map((item) => {
                          return (
                            <div className="avatar">
                              <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                  src={item.image_url}
                                  alt="..."
                                  className="shadow h-48 w-48 rounded-full"
                                />
                                <button
                                  className="btn btn-circle absolute top-0 right-0 "
                                  onClick={() =>
                                    handleRemove(
                                      item,
                                      traderItem,
                                      userAccept.inOrOut
                                    )
                                  }
                                >
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
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Dialog.Title className="text-lg font-medium text-gray-900 text-center font-semibold pt-5">
                      Inventory
                    </Dialog.Title>

                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <HaggleInventory
                        user={userObj.id}
                        setUserItem={setUserItem}
                        setTraderItem={setTraderItem}
                        swap={swap}
                        inOrOut={userAccept.inOrOut}
                        items={traderItem}
                      />
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* <Chat
        MyUserName={userObj.username}
        TheirUserName={traderObj.username}
        MyAvatarUrl={userObj.avatarUrl}
        TheirAvatarUrl={traderObj.avatarUrl}
        receiver={traderObj.id}
        sender={userObj.id}
        swap={swap}
      /> */}

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
                  <div key={item.id} className="relative">
                    <img
                      src={item.image_url}
                      alt=""
                      className="shadow h-48 w-48 mask mask-squircle relative "
                    />
                    <button
                      className="btn btn-circle absolute top-0 right-0 "
                      onClick={() =>
                        handleRemove(item, traderItem, userAccept.inOrOut)
                      }
                    >
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
                  </div>
                );
              })}
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

//  <div className="lg:hidden drawer drawer-end absolute h-96">
//    <div className="drawer-content">
//      <label
//        htmlFor="my-drawer-4"
//        className="btn btn-primary drawer-button pr-5 pl-5 w-24 absolute right-1 top-1"
//      >
//        Menu
//      </label>
//      {userAccept.userAccept ? (
//        traderAccept.userAccept ? (
//          <div>
//            <button
//              type="button"
//              className="btn pr-5 pl-5 w-24 absolute right-1 top-20"
//              onClick={() => handleConfimation(userAccept.inOrOut)}
//            >
//              Mark Complete
//            </button>
//            <div className=" h-20 card bg-base-300 rounded-box place-items-center text-lg font-semibold mt-3">
//              <p className="py-4">
//                By clicking confirm you both have met each other
//              </p>
//            </div>
//          </div>
//        ) : (
//          <button className="btn pr-5 pl-5 w-24 absolute right-1 top-20 loading">
//            Waiting...
//          </button>
//        )
//      ) : (
//        <button
//          className="pr-5 pl-5 w-24 absolute right-1 top-20 btn "
//          onClick={() => handleAcceptance(userAccept)}
//        >
//          Accept Terms
//        </button>
//      )}
//    </div>
//    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//    <div className="drawer-side overflow-y-auto w-1/2 ">
//      <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

//      <ul className="menu absolute overflow-y-auto md:h-auto mb-56 h-96 bg-base-100 text-base-content w-5/6 pl-5 pr-5">
//        <label
//          htmlFor="my-drawer-4"
//          className="btn btn-primary relative drawer-button pr-5 pl-5 ml-5 mt-5"
//        >
//          close
//        </label>

//        <p className="text-xl font-semibold mb-4 mt-6">Current Trade</p>
//        <div className="flex w-full">
//          <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center text-xl font-semibold">
//            {traderObj.username}
//          </div>
//          <div className="divider divider-horizontal">Swap</div>
//          <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center text-xl font-semibold">
//            Your Item
//          </div>
//        </div>

//        <div className="flex grid grid-cols-2 pt-5">
//          <div className="avatar">
//            <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//              <img
//                src={userItem.image_url}
//                alt="..."
//                className="shadow h-48 w-48 rounded-full"
//              />
//            </div>
//          </div>

//          <div className="avatar">
//            <div className="w-48 rounded-full ring ring-primary ring-offset-base-500 ring-offset-2">
//              <img
//                src={traderItem.image_url}
//                alt="..."
//                className="shadow h-48 w-48 rounded-full"
//              />
//            </div>
//          </div>
//        </div>
//        <label className="swap swap-flip text-xl pt-10">
//          <input type="checkbox" />

//          <div className="swap-on">
//            <div
//              type="button"
//              className="grid h-20 card bg-base-300 rounded-box place-items-center"
//            >
//              Your Inventory
//            </div>
//            <HaggleInventory
//              user={userObj.id}
//              setItem={setTraderItem}
//              swap={swap}
//            />
//          </div>
//          <div className="swap-off">
//            <div className="grid h-20 card bg-base-300 rounded-box place-items-center ">
//              {traderObj.username} Inventory
//            </div>
//            <HaggleInventory user={notUserId} />
//          </div>
//        </label>
//      </ul>
//    </div>
//  </div>;
