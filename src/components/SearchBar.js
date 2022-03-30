import React, { useState, useEffect } from "react";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

function SearchBar(props) {
  const [loading, setLoading] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const user = supabase.auth.user();
  const [items, setItems] = useState([]);

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

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = items.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };
  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };
  return (
    <div className="md:flex hidden md:justify-center">
      {loading ? (
        <p>loading</p>
      ) : (
        <div className="flex relative flex-col w-[80%] z-20">
          <div className="flex items-center rounded-full py-2 md:border-2 md:shadow-sm ">
            <input
              className="w-full bg-transparent pl-5 text-sm text-gray-600 placeholder-gray-400 outline-none"
              placeholder="Search"
              type="text"
              onChange={handleFilter}
              value={wordEntered}
            />

            <div className="">
              {filteredData.length === 0 ? (
                <SearchIcon className="h-6 hidden md:inline-flex cursor-pointer md:mx-2 pr-1" />
              ) : (
                <XIcon
                  className="h-6  hidden md:inline-flex cursor-pointer pr-2"
                  onClick={clearInput}
                />
              )}
            </div>
            <div className="top-14 shadow absolute z-10 bg-white mt-1 pb-1 w-full  ">
              {filteredData.slice(0, 10).map((item, key) => {
                return (
                  <div className="mt-1 px-3 py-1 lg:py-2 hover:bg-gray-100 duration-100 ">
                    <Link className="flex space-x-2" to={`/items/${item.id}`}>
                      <img
                        className="h-7 w-7 rounded-sm md:h-9 md:w-9 lg:w-11 lg:h-11"
                        src={item.image_url}
                        alt=""
                      />
                      <div>
                        <p className=" align-middle	 cursor-pointer lg:text-lg">
                          {item.name}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
