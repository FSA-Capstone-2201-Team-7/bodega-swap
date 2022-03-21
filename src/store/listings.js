import { supabase } from "../supabaseClient";

// Action types
const GET_LISTINGS = "GET_LISTINGS";

// Action creators
const getListings = (listings) => {
  return {
    type: GET_LISTINGS,
    listings,
  };
};

export const fetchListings = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("userId", userId);
      dispatch(getListings(data));
    } catch (err) {
      console.log(err);
    }
  };
};

//Reducer

const listingsReducer = (state = [], action) => {
  switch (action.type) {
    case GET_LISTINGS:
      return action.listings;
    default:
      return state;
  }
};
export default listingsReducer;
