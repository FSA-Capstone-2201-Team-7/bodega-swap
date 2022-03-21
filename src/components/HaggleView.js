import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';

const HaggleView = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [swap, setSwap] = useState(null);
  const location = useLocation(null);
  const { item = '' } = location.state || {};
  const user = supabase.auth.user();

  useEffect(() => {
    const getAllSwaps = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `
            hagglerid,
            ownerId,
            id,
            hagglerWants,
            ownerWants,
            status
            `
          )
          .eq('hagglerid', user.id)
          .eq('ownerId', item.userId);
        setSwap(data);

        console.log('users', data);
      } catch (error) {
        console.error('try agina', error);
      }
    };
    getAllSwaps();
  }, [user, item]);

  console.log('owenerid', item.userId);
  console.log('hagglerId', user.id);
  useEffect(() => {
    const makeSwap = async () => {
      try {
        if (!swap.length) {
          const { data: newSwap } = await supabase.from('swaps').insert([
            {
              hagglerid: user.id,
              status: 'pending',
              ownerId: item.userId,
              hagglerWants: [item.id],
            },
          ]);
          setSwap(newSwap);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    makeSwap();
  }, [swap]);
  return (
    <div>
      <div className="HaggleprofileViews">Profiles</div>
      <div className="Haggleitems">Items</div>
      <div className="haggleChat">Chat</div>
    </div>
  );
};
export default HaggleView;

//   return loading ? (
//     <p>Loading</p>
//   ) : (
//     <div>
//       <Container>
//         <img
//           src="https://bcmquwtslvmqbutdhiyo.supabase.in/storage/v1/object/sign/avatars/xsMH4DxwTEdURCh9VqXCHP-1024-80.jpg.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3hzTUg0RHh3VEVkVVJDaDlWcVhDSFAtMTAyNC04MC5qcGcud2VicCIsImlhdCI6MTY0NzczODM5NiwiZXhwIjoxOTYzMDk4Mzk2fQ.s87b7EnfgVX8LDQdRGEri7GXivhj6FGR3xUyQ0pZRuc"
//           alt=""

//         />
//         <Button variant="primary" type="submit">
//           Inventory
//         </Button>
//       </Container>
//       <Container className="OwnerWants">
//         {/* {ownerWantsItems.map((el) => {
//           return (
//             <div>
//               <img src={el.image_url} alt="" />
//             </div>
//           );
//         })} */}
//         {/* {ownerWantsItems ? (
//           ownerWantsItems.map((el) => {
//             return <div key={el.id}>{el.name}</div>;
//           })
//         ) : (
//           <div>add</div>
//         )} */}
//       </Container>
//       <Container>
//         <Image
//           src="https://bcmquwtslvmqbutdhiyo.supabase.in/storage/v1/object/sign/avatars/external-content.duckduckgo.com.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2V4dGVybmFsLWNvbnRlbnQuZHVja2R1Y2tnby5jb20uanBnIiwiaWF0IjoxNjQ3NzM4NDgwLCJleHAiOjE5NjMwOTg0ODB9.M3dUjFKXtqWqYRhzn31IPLY7yHkoDlMJUnQHZIeWO7g"
//           alt=""
//           roundedCircle={true}
//         />
//         <Button variant="primary" type="submit">
//           Inventory
//         </Button>
//       </Container>
//     </div>
//   );
// };
// export default HaggleView;
