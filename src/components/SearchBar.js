import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
function SearchBar() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [list, setList] = useState([]);
  const user = supabase.auth.user();

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("items")
          .select()
          .not(
            "ownerId",
            "eq",
            user ? user.id : "11111111-1111-1111-1111-111111111111"
          );

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
  return (
    <div>
      <div className="searchinput">
        <input placeholder="Search" type="text" />
        <div className="icon">
          <SearchIcon />
        </div>
      </div>
      <div className="dataresult"></div>
    </div>
  );
}

export default SearchBar;
