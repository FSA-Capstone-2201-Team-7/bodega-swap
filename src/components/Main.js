import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Carousel, { CarouselItem } from "./UseCarousel";

import Card from "./Card";

const Main = () => {
  const [getImages, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = supabase.auth.user();

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select(`name, description, ownerId, id, category, listed, image_url`)
          .eq("listed", true)
          .neq(
            "ownerId",
            user ? user.id : "11111111-1111-1111-1111-111111111111"
          );

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
        <div className="mt-3 relative flex h-1/3 lg:h-2/3 bg-white border overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1543372742-e08542e25f8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWVtcGhpcyUyMHRlbm5lc3NlZXxlbnwwfHwwfHw%3D&w=1000&q=80"
            alt=""
            className="h-96 w-full object-cover backdrop-brightness-90"
          />
          <div className="absolute inset-y-14 rounded-lg p-4 text-indigo-50 text-4xl md:text-5xl lg:text-7xl pl-20 pt-10">
            <p>The Largest</p>
            <p>Community of</p>
            <p>Swapping Enthusiasts</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold mb-4 mt-6">Categories</p>
        <div className="flex flex-no-wrap overflow-x-scroll scrolling-touch items-start mb-8">
          {getImages.map((image) => {
            return (
              <div
                key={image.id}
                className="flex-none mr-8 relative border rounded-lg"
              >
                <Card imageUrl={image.image_url} id={image.id} />
              </div>
            );
          })}
        </div>
        <div>Recently Added</div>

        {/* {keep to use for eventual use on main page} */}
        {/* <Carousel>
          {getImages.map((image) => {
            return (
              <CarouselItem>
                <Card imageUrl={image.image_url} id={image.id} />
              </CarouselItem>
            );
          })}

        </Carousel> */}
      </div>
    </div>
  );
};

export default Main;
