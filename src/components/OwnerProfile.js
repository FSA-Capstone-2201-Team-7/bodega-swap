import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useLocation } from "react-router-dom";
import OwnerListings from "./OwnerListings";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";

const OwnerProfile = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { item = "" } = location.state || {};
  console.log("item", item);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("users")
          .select("*")
          .eq("id", item.ownerId)
          .single();

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);
  console.log("owner", user);
  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="flex gap-10">
          <div className="avatar-container">
            <img src={user.avatarUrl} alt="" />
          </div>
          <div>
            <h3>{user.username}</h3>
            <h3>Gold</h3>
            <h2>REP</h2>
            <div className="flex space-x-4">
              <div>
                {" "}
                <ThumbUpIcon className="h-8" />
                <p>85%</p>
              </div>
              <div>
                {" "}
                <ThumbDownIcon className="h-8" />
                <p>15%</p>
              </div>
            </div>
          </div>
          <div>
            <h3>Total Swaps</h3>
            <div className="flex space-x-4">
              <div>
                <p>Completed</p>
                <p>87</p>
              </div>
              <div>
                <p>Active</p>
                <p>12</p>
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
