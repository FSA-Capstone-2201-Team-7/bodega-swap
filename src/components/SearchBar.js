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
    <div className="flex-grow">
      {loading ? (
        <p>loading</p>
      ) : (
        <div className="flex flex-col ">
          <div className="flex items-center rounded-full py-2 md:border-2 md:shadow-sm ">
            <input
              className="flex-grow bg-transparent pl-5 text-sm text-gray-600 placeholder-gray-400 outline-none"
              placeholder="Search"
              type="text"
              onChange={handleFilter}
              value={wordEntered}
            />

            <div className="">
              {filteredData.length === 0 ? (
                <SearchIcon className="h-6  hidden md:inline-flex cursor-pointer md:mx-2" />
              ) : (
                <XIcon
                  className="h-6  hidden md:inline-flex cursor-pointer"
                  onClick={clearInput}
                />
              )}
            </div>
          </div>
          <div className="shadow top-16 absolute z-10 bg-white mt-1 ">
            {filteredData.slice(0, 10).map((item, key) => {
              return (
                <div className="mt-1 px-2  hover:bg-gray-200 ">
                  <Link to={`/items/${item.id}`}>
                    <p className="cursor-pointer">{item.name}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
