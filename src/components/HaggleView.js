import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';



const HaggleView = ({state}) => {
     const [loading, setLoading] = useState(true);
      const location = useLocation();
    
   const {item = ''} = location.state || {}

const user = supabase.auth.user();
console.log(item)
///create a new barter 
// useEffect(() => {
//   const barter = async () => {
//     const { data, error } = await supabase.from('barters').insert([
//       {
//         hagglerid: user.id,
//         status: 'pending',
//         ownerId: item.userId,
//         hagglerWants: [item.id]

//       },
//     ]);
    
//   };
//   barter()
// }, [user, item])



  // useEffect(() => {
  //     const getBarter = async () => {
  //       try {
  //         setLoading(true);
  //         const { data, error } = await supabase
  //           .from('barters')
  //           .select()
  //           .eq('hagglerid', user.id);
  //           // .match({ hagglerid: user.id });
  //         if (data) {
  //           setSwap(data[0]);
  //         }
  //       } catch (error) {
  //         console.error('try agina', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     getBarter()
  // }, [user.id])
  // console.log(swapInfo)

  return <div>hello</div>;
}
export default HaggleView

// import React, { useState, useEffect } from 'react';
// import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
// import { supabase } from '../supabaseClient';
// import { useParams } from 'react-router';
// import { Card, Image, Form, Button, Container } from 'react-bootstrap';

// const HaggleView = ({item}) => {

//   console.log(item)

//    const [loading, setLoading] = useState(true);
//    const [swapInfo, setSwap] = useState({});
// //   const [ownerWantsItems, setOwnerWants] = useState();
// //   const [hagglerWantsItems, setHagglerWants] = useState();

//   useEffect(() => {
//     getBarter();

//   }, [item]);

// //   // will move to differe component then pass swapinfo through params
//   const getBarter = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('barters')
//         .select()
//         .match({ id: 1 });
//       if (data) {
//         setSwap(data[0]);
//       }
//     } catch (error) {
//       console.error('try agina', error);
//     } finally {
//       setLoading(false);
//     }
//   };

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

// let items = [];
// const getItemsOwner = async () => {
//   try {
//     setLoading(true);
//     if(ownerWants) {
//     ownerWants.map(async (el) => {
//       const { data, error } = await supabase
//         .from('items')
//         .select()
//         .match({ id: el });
//       if(data) {
//        setOwnerWants([
//  ...ownerWantsItems
//  data[0]
//]);

//       }
//        setOwnerWants(items);

//     });
//   }

//   } catch (error) {
//     console.error('try agina', error);
//   } finally {
//     setLoading(false);
//   }

// };
// let items2 = []
// const getItemsHaggler = async () => {
//   try {
//     setLoading(true);
//     hagglerWants.map(async (el) => {
//       const { data, error } = await supabase
//         .from('items')
//         .select()
//         .match({ id: el });
//       if (data) {
//         items2.push(data[0]);
//       }
//     });
//     setHagglerWants(items2)
//   } catch (error) {
//     console.error('try agina', error);
//   } finally {
//     setLoading(false);
//   }
// }

// console.log('haggleritems', hagglerWantsItems);
//console.log('owner Items', ownerWantsItems);
// const { singleItem } = getSingleItems();
// console.log(ownerWantsItems);

//   const { ownerWants } = swapInfo;

//   const getItemsOwner = () => {
//     try {
//       setLoading(true);

//        ownerWants.map(async (el) => {
//         const { data, error } = await supabase
//           .from('items')
//           .select(`*, users(username)`)
//           .eq('id', params.id);
//           // .from('items')
//           // .select()
//           // .match({ id: el });
//           console.log(data)

//         if (data) {
//           setOwnerWants([

//          data[0]

//           ]);
//         }
//       });

//     } catch (error) {
//       console.error('try agina', error);
//     } finally {
//       setLoading(false);
//     }

//   };
// console.log('items', ownerWantsItems)




  // const [loading, setLoading] = useState(true);
  // const [barter, setBarter] = useState([]);
  // const user = supabase.auth.user();
  // console.log('user', user.id);
  // useEffect(() => {
  //   buildBarter();
  // }, [user.id]);
  // const buildBarter = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from('barters')
  //       .insert([{ userId: user.id }]);

  //     console.log('getting', { ...data });
  //     // const { data, error, status } = await supabase
  //     //   .from('barters')
  //     //   .select()
  //     //   .match({ id: null });
  //     if (data) {
  //       setBarter(data);
  //     }
  //   } catch (error) {
  //     console.error('try agina', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
////