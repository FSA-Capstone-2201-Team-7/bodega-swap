// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';
// import { Link } from 'react-router-dom';
// import ToggleWishlistButton from './ToggleWishlistButton';
// import FilterCategory from './FilterCategories';

// const AllItems = () => {
//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState(null);
//   const user = supabase.auth.user();

//   useEffect(() => {
//     const getItems = async () => {
//       try {
//         setLoading(true);
//         let { data, error, status } = await supabase
//           .from('items')
//           .select()
//           .not(
//             'ownerId',
//             'eq',
//             user ? user.id : '11111111-1111-1111-1111-111111111111'
//           );

//         if (error && status !== 406) {
//           throw error;
//         }
//         if (data) {
//           setItems(data);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getItems();
//   }, []);

//   return (
//     <div>
//       {loading ? (
//         <p>Loading</p>
//       ) : (
//         <div className="grid grid-cols-3  gap-10 ">
//           <FilterCategory />
//           {items.map((item, idx) => {
//             return (
//               <div key={idx} className="single-item-container">
//                 <p>{item.name}</p>
//                 <p>{item.description}</p>
//                 <Link to={`/items/${item.id}`}>
//                   <img src={item.image_url} alt="" />
//                 </Link>
//                 <Link to="/createproposal" state={{ item }}>
//                   <button
//                     type="button"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
//                   >
//                     Create Proposal
//                   </button>
//                 </Link>
//                 {user ? (
//                   <ToggleWishlistButton userId={user.id} itemId={item.id} />
//                 ) : (
//                   <></>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllItems;

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import ToggleWishlistButton from './ToggleWishlistButton';
import FilterCategory from './FilterCategories';

const AllItems = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const [filterItem, setFilterItem] = useState('');
  const [list, setList] = useState([]);
  const user = supabase.auth.user();

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('items')
          .select()
          .not(
            'ownerId',
            'eq',
            user ? user.id : '11111111-1111-1111-1111-111111111111'
          );

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setItems(data);
          
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  
  useEffect(() => {
    const filter = async () => {
      try {
        const set =  Array.from(
           new Set(
            items.map((type) => {
              return type.category;
            })
          )
        );
        set.unshift('All');

        setList(set);
      } catch (error) {
        console.error(error)
      }
    }
    filter()
  }, [items])
  // useEffect(() => {
  //   try {
  //     const itemsToShow = async () => {
  //       items.filter((item) => {
  //         console.log(item)
  //         if (filterItem !== 'All') {
  //           return item.category === filterItem;
  //         }
  //         return true;
  //       });
  //     };
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }, []);

  // const itemsToShow = items.filter((item) => {
  //   if (filterItem !== 'All') {
  //     return item.category === filterItem;
  //   }
  //   return true;
  // });
  // console.log('items', items);
console.log('clicked', filterItem);
  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="grid grid-cols-3  gap-10 ">
          <FilterCategory list={list} setSelected={setFilterItem} loading={loading} />
          {items.map((item, idx) => {
            return (
              <div key={idx} className="single-item-container">
                <p>{item.name}</p>
                <p>{item.description}</p>
                <Link to={`/items/${item.id}`}>
                  <img src={item.image_url} alt="" />
                </Link>
                <Link to="/createproposal" state={{ item }}>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Create Proposal
                  </button>
                </Link>
                {user ? (
                  <ToggleWishlistButton userId={user.id} itemId={item.id} />
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllItems;
