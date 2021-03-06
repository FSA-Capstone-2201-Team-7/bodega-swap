import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useLocation } from "react-router-dom";
import OwnerListings from "./OwnerListings";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";
import LoadingPage from "./LoadingPage";
const OwnerProfile = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { item = "" } = location.state || {};

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('users')
          .select('*')
          .eq('id', item.ownerId)
          .single();

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="flex flex-col md:flex-row p-5 my-2 gap-8 md:gap-12">
          <div className="avatar-container flex items-center justify-center">
            <img
              className="h-52 w-48 rounded-full"
              src={
                user.avatarUrl
                  ? user.avatarUrl
                  : "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png"
              }
              alt=""
            />
          </div>

          <div className="flex flex-col items-center justify-center md:pr-16">
            <h3 className="font-semibold text-3xl mb-2">{user.username}</h3>
            <div className="flex space-x-4">
              <div>
                {" "}
                <ThumbDownIcon className="h-8 fill-yellow-400 stroke-yellow-500" />
                <p>
                  {Math.ceil(
                    100 * (user.downvotes / (user.upvotes + user.downvotes))
                  )}
                  %
                </p>
              </div>
              <div>
                {" "}
                <ThumbUpIcon className="h-8 fill-yellow-400 stroke-yellow-500" />
                <p>
                  {Math.ceil(
                    100 * (user.upvotes / (user.upvotes + user.downvotes))
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3 className="font-semibold text-2xl mb-2">Total Swaps</h3>
            <div className="flex space-x-4">
              <div>
                <div className="flex items-center ">
                  <p className="text-xl pr-1">Completed </p>
                  <div className="inline-flex w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex justify-center">
                  {user.swaps_completed}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <OwnerListings user={{ ...user }} />
    </div>
  );
};

export default OwnerProfile;
