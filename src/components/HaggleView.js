import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import Chat from './Chat';
import Card from './Card';
import HaggleInventory from './HaggleInventory';

const HaggleView = ({ state }) => {
  const location = useLocation(null);
  const { swap = '' } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [yourInfo, setYourInfo] = useState({});
  const [theirInfo, setTheirInfo] = useState({});
  const [notUserId, setNotUserId] = useState('');
  const [inventory, setInventory] = useState('');
  const user = supabase.auth.user();

  //here we get the users info and avatar and spread them into new object to render into haggle view
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

        if (swap.outbound_id !== user.id) {
          setYourInfo({
            ...swap.outbound_offer,
            ...data[0],
            userAccept: swap.outbound_accept,
            inOrOut: 'outbound',
          });
          setNotUserId(swap.outbound_id);
        } else {
          setYourInfo({
            ...swap.inbound_offer,
            ...data[0],
            userAccept: swap.inbound_accept,
            inOrOut: 'inbound',
          });

          setNotUserId(swap.inbound_id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    you();
  }, [
    swap.outbound_id,
    swap.inbound_id,
    swap.inbound_offer,
    swap.outbound_offer,
    user.id,
    swap.inbound_accept,
    swap.outbound_accept,
  ]);

  //here we grab the non-users infor and do the same thing
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
          .eq('id', notUserId);
          
        if (swap.outbound_id !== user.id) {
          setTheirInfo({
            ...swap.inbound_offer,
            ...data[0],
            notUserAccept: swap.inbound_accept,
            inOrOut: 'inbound',
          });
        } else {
          setTheirInfo({
            ...swap.outbound_offer,
            ...data[0],
            notUserAccept: swap.outbound_accept,
            inOrOut: 'outbound',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    them();
  }, [
    notUserId,
    swap.inbound_offer,
    swap.outbound_id,
    swap.outbound_offer,
    user.id,
    swap.inbound_accept,
    swap.outbound_accept,
  ]);

  // final settlement between users are set when both agree 
  // the database is updated from 'active' to 'processing?'
  //this is completed when both users hand off the trade 
  // another method here may be to set it as complete and render a time
  //limit for both the exchange items or repurcussion on there reputation status may happen
  useEffect(() => {
    const setAgreement = async () => {
      try {
        if (swap.inbound_accept === true && swap.outbound_accept === true) {
          await supabase
            .from('swaps')
            .update({
              status: 'complete',
            })
            .eq('id', swap.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setAgreement();
  }, [swap.id, swap.outbound_accept, swap.inbound_accept]);

  //still working on this for realtime purposes
  const handleAcceptance = async (check) => {
    try {
      if (check.inOrOut === 'inbound') {
        const { data } = await supabase
          .from('swaps')
          .update({
            inbound_accept: true,
          })
          .eq('id', swap.id);
        if (data) {
          supabase
            .from('swaps')
            .on('UPDATE', (payload) => {
              setYourInfo({ ...yourInfo, userAccept: true });
            })
            .subscribe();
        }
      } else {
        const { data } = await supabase
          .from('swaps')
          .update({
            outbound_accept: true,
          })
          .eq('id', swap.id);
        
        if (data) {
          supabase
            .from('swaps')
            .on('UPDATE', (payload) => {
              setYourInfo({ ...yourInfo, userAccept: true });
            })
            .subscribe();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? (
    <div>Loading....</div>
  ) : swap.inbound_accept === true && swap.outbound_accept === true ? (
    <div>in process</div>
  ) : (
    <div className="grid grid-cols-3 px-10 justify-items-center gap-10 mt-36">
      <div className="realtive justify-center">
        <div className="w-6/12 sm:w-2/12 px-4 grid place-items-center">
          <img
            //src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png"
            // we my need this for default
            src={yourInfo.avatarUrl}
            alt="..."
            className="shadow rounded-full w-full  align-middle border-none ml-52"
          />
        </div>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="flex grid grid-cols-2">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button "
                onClick={() => setInventory(yourInfo.inOrOut)}
              >
                Open Inventory
              </label>

              {yourInfo.userAccept ? (
                <div>
                  <button className="btn loading btn-xs sm:btn-sm md:btn-md w-full">
                    Waiting Response
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md w-full"
                  onClick={() => handleAcceptance(yourInfo)}
                >
                  Accept Terms
                </button>
              )}
            </div>

            <div className="bg-red-300 w-full grid grid-rows-1 justify-center pt-16 pb-16">
              <Card id={yourInfo.id} imageUrl={yourInfo.image_url} />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content mr-12">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory('')}
              >
                Close Inventory
              </label>
              <HaggleInventory user={user.id} />
            </ul>
          </div>
        </div>
      </div>

      <div className="relative">
        <Chat receiver={notUserId} sender={user.id} />
      </div>

      <div className="realtive justify-center">
        <div className="w-6/12 sm:w-2/12 px-4 grid place-items-center">
          <img
            //src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-4-470x470.png"
            // we may need this for default
            src={theirInfo.avatarUrl}
            alt="..."
            className="shadow rounded-full w-full border-none ml-52"
          />
        </div>
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="flex grid grid-cols-2">
              {theirInfo.notUserAccept ? (
                <div>
                  <button className="btn loading btn-xs sm:btn-sm md:btn-md w-full">
                    Waiting Response
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md w-full text-black"
                  disabled="disabled"
                  onClick={() => handleAcceptance(theirInfo)}
                >
                  Accept Terms
                </button>
              )}
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory(theirInfo.inOrOut)}
              >
                Open Inventory
              </label>
            </div>

            <div className="bg-red-300 w-full grid grid-rows-1 justify-center pt-16 pb-16">
              <Card id={theirInfo.id} imageUrl={theirInfo.image_url} />
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
              <HaggleInventory user={notUserId} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaggleView;
