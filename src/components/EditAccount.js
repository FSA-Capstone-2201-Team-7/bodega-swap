import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "./Avatar";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("users")
        .select(`username`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatarUrl);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        avatarUrl,
        updatedAt: new Date(),
      };

      let { error } = await supabase.from("users").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto  p-10" aria-live="polite">
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} className=" flex-col px-[25%] ">
          <div className="form-widget">
            <Avatar
              url={avatarUrl}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ username, avatarUrl: url });
              }}
            />
          </div>
          <div className="py-5">Email: {session.user.email}</div>
          <div className="flex-col ">
            <div>
              <label className="text-gray-900" htmlFor="username">
                Name
              </label>
            </div>
            <input
              className="border-purple-900 border py-1 w-full "
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <button
              className="cursor-pointer mt-5 rounded-lg bg-purple-900 px-4 py-2 text-sm text-white w-full hover:bg-purple-700"
              disabled={loading}
            >
              UPDATE PROFILE
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Account;
