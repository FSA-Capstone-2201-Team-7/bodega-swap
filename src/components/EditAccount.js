import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: '',
    avatarUrl: '',
    avatarFileName: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from('users')
          .select(`username, avatarUrl, avatarFileName`)
          .limit(1)
          .single()
          .eq('id', user.id);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setProfileData({
            username: data.username,
            avatarUrl: data.avatarUrl,
            avatarFileName: data.avatarFileName,
          });
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let fullUrl = supabase.storage
        .from('avatars')
        .getPublicUrl(profileData.avatarFileName);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username: profileData.username,
        avatarFileName: profileData.avatarFileName,
        avatarUrl: fullUrl.publicURL,
        updatedAt: new Date(),
      };

      let { data, error } = await supabase.from('users').upsert(updates);

      if (error) {
        throw error;
      }

      if (data) alert('Profile Successfully Updated!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      navigate('/myAccount');
    }
  };

  return (
    <div className="mx-auto  p-10" aria-live="polite">
      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={handleSubmit} className=" flex-col px-[25%] ">
          <div className="form-widget">
            <Avatar
              url={profileData.avatarFileName}
              size={150}
              onUpload={async (fileName) => {
                await supabase.storage
                  .from('avatars')
                  .remove([profileData.avatarFileName]);
                setProfileData({ ...profileData, avatarFileName: fileName });
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
              value={profileData.username}
              onChange={(e) =>
                setProfileData({ ...profileData, username: e.target.value })
              }
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
