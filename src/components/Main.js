import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Carousel, { CarouselItem } from "./UseCarousel";
import LoadingPage from "./LoadingPage";
import Card from "./Card";
import StepBar from "./StepBar";

const Main = () => {
  const [getImages, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  // const [recentlyadded, setRecentlyAdded] = useState([])
  const user = supabase.auth.user();

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select(
            `name, description, ownerId, id, category, listed, image_url, created_at`
          )
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

  useEffect(() => {
    const filter = async () => {
      try {
        const set = Array.from(
          new Set(
            getImages.map((type) => {
              return type.category;
            })
          )
        );
        setList(set);
      } catch (error) {
        console.error(error);
      }
    };
    filter();
  }, [getImages]);

  useEffect(() => {
    const catergories = () => {
      try {
        const check = [];
        const image = [];
        list.map((cat) => {
          getImages.forEach((item) => {
            if (cat === item.category) {
              if (!check.includes(cat)) {
                check.push(cat);
                image.push([cat, item.image_url]);
              }
            }
          });
        });
        setCategoryList(image);
      } catch (error) {
        console.error(error);
      }
    };
    catergories();
  }, [list, getImages]);

  const recentlyadded = getImages.slice(Math.max(getImages.length - 5, 1));

  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      <div className="mt-3 relative flex h-1/3 lg:h-2/3 bg-white border overflow-hidden shadow-lg shadow-indigo-500/50 ">
        <img
          src="https://images.unsplash.com/photo-1543372742-e08542e25f8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWVtcGhpcyUyMHRlbm5lc3NlZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt=""
          className="h-96 w-full object-cover backdrop-brightness-90 rounded-md "
        />
        <div className="absolute inset-y-14 rounded-lg p-4 text-indigo-50 text-4xl md:text-5xl lg:text-7xl pl-20 pt-10">
          <p>The Largest</p>
          <p>Community of</p>
          <p>Swapping Enthusiasts</p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold mb-4 mt-6">Categories</p>

        <div className="flex h-96 flex-no-wrap overflow-x-scroll scrollbar-hide  scrolling-touch items-start mb-8">
          {categoryList.map((image, i) => {
            return (
              <div
                key={i}
                className="flex-none mr-8 relative border rounded-lg shadow-md shadow-indigo-400/50"
              >
                <img
                  src={image[1]}
                  alt=""
                  className="h-80 w-96 rounded-t-lg  hover:opacity-60 transition-opacity duration-1000 ease-out"
                />
                <div className="flex bg-white justify-center text-gray-700 text-xl font-semibold pt-1">
                  {image[0]}
                </div>
              </div>
            );
          })}
          {/* {getImages.map((image) => {

            return (
              <div
                key={image.id}
                className="flex-none mr-8 relative border rounded-lg"
              >
                <Card imageUrl={image.image_url} id={image.id} />
              </div>
            );
          })} */}
        </div>
        <div className="text-2xl font-semibold mb-4 mt-6">Recently Added</div>
        <section className="grid p-6 overflow-hidden  grid-cols-8  w-full ">
          <div className=" ">
            <img
              className="object-cover"
              src={recentlyadded[0].image_url}
              alt=""
            />
          </div>
          <div className="">
            <img src={recentlyadded[1].image_url} alt="" />
          </div>
          <div className="h-80 w-96 ml-56">
            <img src={recentlyadded[2].image_url} alt="" />
          </div>
          <div className="h-80 w-96">
            <img src={recentlyadded[3].image_url} alt="" />
          </div>
          <div className="h-80 w-96">
            <img src={recentlyadded[4].image_url} alt="" />
          </div>
        </section>
      </div>
      <StepBar />

      {/* <Carousel>
          {getImages.map((image) => {
            return (
              <CarouselItem>
                <img src={image.image_url} alt="" id={image.id} />
              </CarouselItem>
            );
          })}
        </Carousel> */}
    </div>
  );
};

export default Main;
