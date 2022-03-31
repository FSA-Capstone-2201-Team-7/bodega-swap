import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Card from "./Card";
import HaggleInventory from "./HaggleInventory";
import AgreedButton from "./AgreedButton";
import LoadingPage from "./LoadingPage";

const HaggleView = ({ state }) => {
  const location = useLocation(null);

  const { swap = "" } = location.state || {};

  const [thisSwap, setThisSwap] = useState([]);

  const [loading, setLoading] = useState(true);
  const [yourInfo, setYourInfo] = useState({});
  const [theirInfo, setTheirInfo] = useState({});
  const [notUserId, setNotUserId] = useState("");
  const [inventory, setInventory] = useState("");
  const user = supabase.auth.user();
  const navigate = useNavigate();

  //here we get the users info and avatar and spread them into new object to render into haggle view
  useEffect(() => {
    const you = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("users")
          .select(
            `
          avatarUrl,
          username
          `
          )
          .eq("id", user.id);
        console.log("dta with username", ...data);
        if (swap.outbound_id !== user.id) {
          setYourInfo({
            ...swap.outbound_offer,
            ...data[0],
            ...data[1],
            userAccept: swap.outbound_accept,
            inOrOut: "outbound",
          });
          supabase
            .from("swaps")
            .on("UPDATE", (update) => {
              setYourInfo({
                ...swap.outbound_offer,
                ...data[0],
                ...data[1],
                userAccept: update.new.outbound_accept,
                inOrOut: "outbound",
              });
            })
            .subscribe();
          setNotUserId(swap.outbound_id);
        } else {
          setYourInfo({
            ...swap.inbound_offer,
            ...data[0],
            ...data[1],
            userAccept: swap.inbound_accept,
            inOrOut: "inbound",
          });
          supabase
            .from("swaps")
            .on("UPDATE", (update) => {
              setYourInfo({
                ...swap.outbound_offer,
                ...data[0],
                ...data[1],
                userAccept: update.new.inbound_accept,
                inOrOut: "inbound",
              });
            })
            .subscribe();
          setNotUserId(swap.inbound_id);
        }
        setThisSwap(swap);
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
    swap,
  ]);

  //here we grab the non-users infor and do the same thing
  useEffect(() => {
    const them = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("users")
          .select(
            `

          avatarUrl,
          username

          `
          )
          .eq("id", notUserId);

        if (swap.outbound_id !== user.id) {
          setTheirInfo({
            ...swap.inbound_offer,
            ...data[0],
            ...data[1],
            userAccept: swap.inbound_accept,
            userConfirm: swap.inbound_confirm,
            inOrOut: "inbound",
          });
        } else {
          setTheirInfo({
            ...swap.outbound_offer,
            ...data[0],
            ...data[1],
            userAccept: swap.outbound_accept,
            userConfirm: swap.outbound_confirm,
            inOrOut: "outbound",
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
    swap.inbound_confirm,
    swap.outbound_confirm,
  ]);

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
            .from("swaps")
            .update({
              status: "agreed",
            })
            .eq("id", swap.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setAgreement();
  }, [swap.id, swap.outbound_accept, swap.inbound_accept]);

  //still working on this for realtime purposes
  const handleAcceptance = async (check) => {
    console.log("acceptance", check);

    try {
      if (check.inOrOut === "inbound") {
        await supabase
          .from("swaps")
          .update({
            inbound_accept: true,
          })

          .eq("id", swap.id);
      }

      if (check.inOrOut === "outbound") {
        await supabase
          .from("swaps")
          .update({
            outbound_accept: true,
          })

          .eq("id", swap.id);
      }
      setYourInfo([...yourInfo, { userAccept: true }]);
      setTheirInfo([...theirInfo]);
      supabase
        .from("swaps")
        .on("UPDATE", (button) => {
          setThisSwap(button.new);
          console.log("updated", button.new);
        })
        .subscribe();
    } catch (error) {
      console.error(error);
    }
    // supabase
    //   .from('swaps')
    //   .on('UPDATE', (button) => {
    //     setThisSwap(button.new);
    //     console.log('updated', button.new);
    //   })
    //   .subscribe();
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
                  Congratulations! Both swappers have come to an agreement!
                </h3>
                <p className="py-4">
                  By clicking confirm you both have met each other at the agreed
                  upon location and have swapped the agreed upon items. In order to get credit for a completed transaction, and for the item to change hands, bot swappers must confirm that the swap has taken place, and rate their swapmates.
                </p>
                <div className="modal-action">
                  <label
                    htmlFor="my-modal-5"
                    className="btn"
                    onClick={() => handleConfimation(yourInfo.inOrOut)}
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
            src={yourInfo.avatarUrl}
            alt="..."
            className="shadow h-48 w-48 rounded-full"
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
                See Other Items
              </label>
              {yourInfo.userAccept ? (
                theirInfo.userAccept && yourInfo.userAccept ? (
                  <label
                    htmlFor="my-modal-5"
                    className="btn modal-button w-full"
                  >
                    Swap Complete!
                  </label>
                ) : (
                  <button className="btn loading">Waiting...</button>
                )
              ) : (
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md w-full"
                  onClick={() => handleAcceptance(yourInfo)}
                >
                  Accept Terms
                </button>
              )}
              {/* <AgreedButton
                info={yourInfo}
                handleAcceptance={handleAcceptance}
                swap={thisSwap}
                inOrOut={yourInfo.inOrOut}
              /> */}
            </div>
            <div className="bg-indigo-300 w-full grid grid-rows-1 justify-center pt-16 pb-16">
              <Card id={yourInfo.id} imageUrl={yourInfo.image_url} />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content mr-12">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory("")}
              >
                Close
              </label>
              <HaggleInventory user={user.id} />
            </ul>
          </div>
        </div>
      </div>
      <div className="relative">
        <Chat
          MyUserName={yourInfo.username}
          TheirUserName={theirInfo.username}
          MyAvatarUrl={yourInfo.avatarUrl}
          TheirAvatarUrl={theirInfo.avatarUrl}
          receiver={notUserId}
          sender={user.id}
          swap={swap}
        />
      </div>
      <div className="realtive justify-center">
        <div className="px-4 grid justify-center">
          <img
            src={theirInfo.avatarUrl}
            alt="..."
            className="shadow h-48 w-48 rounded-full border-none"
          />
        </div>
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="flex grid grid-cols-2">
              <button
                className="btn btn-xs sm:btn-sm md:btn-md w-full text-black"
                disabled="disabled"
              >
                Accept Terms
              </button>
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory(theirInfo.inOrOut)}
              >
                See Other Items
              </label>
            </div>
            <div className="bg-gray-100 w-full grid grid-rows-1 justify-center pt-16 pb-16">
              <Card id={theirInfo.id} imageUrl={theirInfo.image_url} />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content ml-12">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory("")}
              >
                Close
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
