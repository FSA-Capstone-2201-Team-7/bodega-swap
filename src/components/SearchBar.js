import React, { useState, useEffect } from "react";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

function SearchBar(props) {
  const [loading, setLoading] = useState(true);
  const { items } = props;
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
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
    <div>
      <div className="flex">
        <input
          placeholder="Search"
          type="text"
          onChange={handleFilter}
          value={wordEntered}
        />

        <div className="">
          {filteredData.length === 0 ? (
            <SearchIcon className="h-6" />
          ) : (
            <XIcon className="h-6 cursor-pointer" onClick={clearInput} />
          )}
        </div>
      </div>
      <div className="shadow px-2">
        {filteredData.slice(0, 10).map((item, key) => {
          return (
            <div className="mt-1 ">
              <Link to={`/items/${item.id}`}>
                <p className="cursor-pointer hover:bg-gray-200">{item.name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;
