import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import MyListings from './MyListings';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';
import LoadingPage from './LoadingPage';
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const User = supabase.auth.user();
  const dvPct = user
    ? Math.ceil(100 * (user.downvotes / (user.upvotes + user.downvotes)))
    : null;
  const uvPct = user
    ? Math.ceil(100 * (user.upvotes / (user.upvotes + user.downvotes)))
    : null;
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('users')
          .select('*')
          .eq('id', User.id)
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
                  : 'https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png'
              }
              alt=""
            />
          </div>

          <div className="flex flex-col items-center justify-center md:pr-16">
            <h3 className="font-semibold text-3xl mb-2">{user.username}</h3>
            <div className="flex space-x-4">
              <div>
                {' '}
                <ThumbDownIcon className="h-8 fill-yellow-400 stroke-yellow-500" />
                <p> {dvPct + uvPct > 100 ? dvPct - 1 : dvPct}%</p>
              </div>
              <div>
                {' '}
                <ThumbUpIcon className="h-8 fill-yellow-400 stroke-yellow-500" />
                <p> {uvPct}%</p>
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
          <div className="flex items-center justify-center">
            <Link to="/editProfile">
              <button className="cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white w-full hover:bg-indigo-400">
                Edit Account
              </button>
            </Link>
          </div>
        </div>
      )}
      <MyListings />
    </div>
  );
};

export default Profile;
