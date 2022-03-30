import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useLocation } from 'react-router-dom';
import OwnerListings from './OwnerListings';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';

const OwnerProfile = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { item = '' } = location.state || {};

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
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="flex flex-col md:flex-row p-5 my-2 gap-8 md:gap-12">
          <div className="avatar-container flex items-center justify-center">
            <img
              className="h-52 w-48 rounded-full"
              src={user.avatarUrl}
              alt=""
            />
          </div>

          <div>
            <h3>{user.username}</h3>
            <h2>REP</h2>
            <div className="flex space-x-4">
              <div>
                {' '}
                <ThumbDownIcon className="h-8" />
                <p>
                  {Math.ceil(
                    100 * (user.downvotes / (user.upvotes + user.downvotes))
                  )}
                </p>
              </div>
              <div>
                {' '}
                <ThumbUpIcon className="h-8" />
                <p>
                  {Math.ceil(
                    100 * (user.upvotes / (user.upvotes + user.downvotes))
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3>Total Swaps Completed</h3>
            <div className="flex space-x-4">
              <div>
                <p>{user.swaps_completed}</p>

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
