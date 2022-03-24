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



  return loading ? (
    <div>loading...</div>
  ) : (
    <div>
      <div>
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
      </div>
      <div>
        <div>Categories</div>

        <Carousel>
          {getImages.map((image) => {
            return <CarouselItem><img src={image.image_url} alt="" /></CarouselItem>;
          })}
          {/* <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
          <CarouselItem>Item 3</CarouselItem> */}
        </Carousel>
      </div>
    </div>
  );
}

export default Main