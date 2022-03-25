import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
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
      <div className="searchinput">
        <input
          placeholder="Search"
          type="text"
          onChange={handleFilter}
          value={wordEntered}
        />

        <div className="icon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <XIcon className="cursor-pointer" onClick={clearInput} />
          )}
        </div>
      </div>
      <div className="dataresult">
        {filteredData.slice(0, 10).map((item, key) => {
          return (
            <div>
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;
