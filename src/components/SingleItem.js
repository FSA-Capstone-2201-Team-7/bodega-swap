import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import ToggleWishlistButton from './ToggleWishlistButton';
import Card from './Card';

const SingleItem = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from('items')
        .select(`*, users:ownerId(username, avatarUrl)`)
        .eq('id', params.id)
        .neq('listed', false);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setItem(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    console.log('item', item);
  };

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : !item ? (
        <div>This item is not currently listed, or no longer exists.</div>
      ) : (
        <div className="flex-col flex gap-8 md:gap-36 md:flex-row mt-5 justify-center">
          <div>
            <img className=" shadow  h-96 w-96 " src={item.image_url} alt="" />

            <div className="flex flex-col mt-5 pt-5 border-t-2">
              <h4 className="text-xl font-medium	">Meet the Owner</h4>
              {user ? (
                <button
                  className="pt-4 items-center  flex"
                  type="button"
                  onClick={() => navigate('OwnerProfile', { state: { item } })}
                >
                  <img
                    className="w-16 h-16 rounded-full"
                    src={
                      item.users.avatarUrl
                        ? item.users.avatarUrl
                        : 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
                    }
                    alt=""
                  />
                  <p className="pl-5 text-lg font-semibold">
                    {' '}
                    {item.users.username}
                  </p>
                </button>
              ) : (
                <h3>
                  <p>Owner: {item.users.username}</p>
                </h3>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-3xl font-semibold mb-6">{item.name}</p>
            <p className="font-semibold text-lg mb-3">Desciption</p>
            <p>{item.description}</p>
            {user && user.id !== item.ownerId ? (
              <div className="flex justify-end my-2">
                <ToggleWishlistButton userId={user.id} itemId={item.id} />
              </div>
            ) : (
              <></>
            )}
            <button
              type="button"
              className="bg-indigo-600 mb-2 hover:bg-indigo-500 text-white font-bold py-2 px-4 mt-2 rounded-md"
              onClick={() => navigate('/createproposal', { state: { item } })}
            >
              Propose Trade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleItem;
// {
//   /* <p>{item.name}</p>
//           <button
//             type="button"
//             onClick={() => navigate('OwnerProfile', { state: { item } })}
//           >
//             <p>Owner: {item.users.username}</p>
//           </button>

//           <p>{item.description}</p>
//           <img src={item.image_url} alt="" />
//           {user ? (
//             <ToggleWishlistButton userId={user.id} itemId={item.id} />
//           ) : (
//             <></>
//           )} */
// }
