import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate,useLocation } from "react-router-dom";
import ToggleWishlistButton from "./ToggleWishlistButton";
import FilterCategory from "./FilterCategories";
import Card from "./Card";
import ForumIcon from "@mui/icons-material/Forum";
import SearchBar from "./SearchBar";
import LoadingPage from "./LoadingPage";

const AllItems = ({state}) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filterItem, setFilterItem] = useState('All');
  const [list, setList] = useState([]);
  const user = supabase.auth.user();
  const navigate = useNavigate();
  const location = useLocation()
  const { image = '' } = location.state || {};

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select()
          .neq(
            "ownerId",
            user ? user.id : "11111111-1111-1111-1111-111111111111"
          )
          .neq("listed", false);

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
        const set = Array.from(
          new Set(
            items.map((type) => {
              return type.category;
            })
          )
        );
        set.unshift("All");

        setList(set);
      } catch (error) {
        console.error(error);
      }
    };
    filter();
  }, [items]);
  useEffect(() => {
    const categoryFromMain = () => {
      try {
        if(image[0]) {
          setFilterItem(image[0])
        }
        
      } catch (error) {
        console.error(error)
      }
    }
    categoryFromMain()
  }, [image])

  
  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-10 justify-items-center gap-10 ">
          <FilterCategory
            list={list}
            setSelected={setFilterItem}
            loading={loading}
          />
          {items.map((item, idx) => {
            if (filterItem === "All" || item.category === filterItem) {
              return (
                <div key={item.id}>
                  <Card
                    id={item.id}
                    imageUrl={item.image_url}
                    name={item.name}
                    category={item.category}
                    ownerId={item.ownerId}
                    firstButton={
                      user && user.id !== item.ownerId ? (
                        <button
                          type="button"
                          className="bg-indigo-600 mb-2 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md"
                          onClick={() =>
                            navigate('/createproposal', { state: { item } })
                          }
                        >
                          Propose Swap
                        </button>
                      ) : (
                        <></>
                      )
                    }
                    secondButton={
                      user && user.id !== item.ownerId ? (
                        <ToggleWishlistButton
                          userId={user.id}
                          itemId={item.id}
                        />
                      ) : (
                        <></>
                      )
                    }
                  />
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default AllItems;

// {/* <Link to="/createproposal" state={{ item }}>
//   <button
//     type="button"
//     className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
//   >
//     <ForumIcon />
//   </button>
// </Link>;
// {
//   user ? <ToggleWishlistButton userId={user.id} itemId={item.id} /> : <></>;
// } */}
