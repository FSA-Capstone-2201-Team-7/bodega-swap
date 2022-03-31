import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import LoadingPage from "./LoadingPage";
import Card from "./Card";
import StepBar from "./StepBar";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [getImages, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate()
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

  const recentlyadded = getImages.slice(getImages.length - 6)

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
                <button
                  type="button"
                  onClick={() => navigate('/items', { state: { image } })}
                >
                  <img
                    src={image[1]}
                    alt=""
                    className="h-80 w-96 rounded-t-lg  hover:opacity-60 transition-opacity duration-1000 ease-out"
                  />
                </button>
                <div className="flex bg-white justify-center text-gray-700 text-xl font-semibold pt-1">
                  {image[0]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-2xl font-semibold mb-4 mt-6">Recently Added</div>
        <div class="flex-grow p-6 overflow-auto bg-gray-200">
          <div class="grid grid-cols-3 gap-6">
            <div class="h-96 col-span-2 bg-white border border-gray-300"></div>
            <div class="h-68 col-span-1 bg-white border border-gray-300"></div>
            <div class="h-24 col-span-1 bg-white border border-gray-300"></div>
            <div class="h-24 col-span-2 bg-white border border-gray-300"></div>
          </div>
        </div>
      </div>
      <StepBar />
      <div className="text-2xl font-semibold mb-4 mt-6">Top Accounts</div>

      <div className="col-span-2">
        <div className="hero w-full">
          <div className="h-56"></div>
          <div class="hero-overlay bg-gray-200">

          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;


  //<section className="grid p-6 overflow-hidden grid-cols-8 gap-4  w-full ">
    /* <div className="col-span-2">
          //   <img
          //     className="h-80 w-full"
          //     src={recentlyadded[0].image_url}
          //     alt=""
          //   />
          // </div>
          // <div className="col-span-2">
          //   <img
          //     className="h-80 w-96"
          //     src={recentlyadded[1].image_url}
          //     alt=""
          //   />
          // </div>
          // <div className="col-span-2">
          //   <img
          //     className="h-80 w-96"
          //     src={recentlyadded[2].image_url}
          //     alt=""
          //   />
          // </div>
          // <div className="col-span-2">
          //   <img
          //     className="h-80 w-96"
          //     src={recentlyadded[3].image_url}
          //     alt=""
          //   />
          // </div>
          // <div className="col-span-2">
          //   <img
          //     className="h-80 w-96"
          //     src={recentlyadded[4].image_url}
          //     alt=""
          //   />
          </div> */
  //{/* </section>; */}
