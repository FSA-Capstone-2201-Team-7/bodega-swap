import React, {useState, useEffect} from 'react'
import { supabase } from '../supabaseClient';
import Carousel, {CarouselItem} from './UseCarousel';


const Main = ({session}) => {
  const [getImages, setImages] = useState([])
  const [loading, setLoading] = useState(true);

   useEffect(() => {
     const getItems = async () => {
       try {
         setLoading(true);
         let { data, error, status } = await supabase
           .from('items')
           .select()
           

         if (error && status !== 406) {
           throw error;
         }
         if (data) {
           setImages(data);
         }
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     getItems();
   }, []);


  console.log(getImages)
  return loading ? (
    <div>loading...</div>
  ) : (
    <div>
      <div>
        {/* <img
        src="https://pbs.twimg.com/media/Da4LRjeWAAAZkLj?format=jpg&name=medium"
        alt=""
      />
      <div>-----</div> */}

        <div className="flex grid bg-white border overflow-hidden">
          <img
            src="https://pbs.twimg.com/media/ElK-sofWAAY8iE7?format=jpg&name=large"
            alt=""
            className="h-96 w-full object-cover saturate-200"
          />
          <div className=" absolute inset-y-14 rounded-lg p-4 text-white text-7xl">
            <ul>The Largest</ul>
            <ul>Community of</ul>
            <ul>Swapping Enthusiasts</ul>
          </div>
        </div>

        {/* <div>----</div>
      <img
        src="https://pbs.twimg.com/media/CoFWFV9WAAE3agy?format=jpg&name=large"
        alt=""
      /> */}
      </div>
      <div>
        <div>Categories</div>
       
          {/* {getImages.map((image) => {
        
              return (
         
                  <CarouselItem key={image.id}>
                    <img src={image.image_url} alt="" />
                  </CarouselItem>
            
              );
            
          })} */}
        
      </div>
    </div>
  );
}

export default Main