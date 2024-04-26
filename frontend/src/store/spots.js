import { csrfFetch } from "./csrf";
import Cookies from "js-cookie";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_ONE = "spots/LOAD_ONE";
const ADD_SPOT = "spots/ADD_SPOT";

export const addSpot = (spotData) => ({
  type: ADD_SPOT,
  spotData,
});

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

export const loadOne = (spot) => ({
  type: LOAD_ONE,
  payload: spot,
});

export const spotCreateThunk = (spotData) => async (dispatch) => {
  console.log(
    "%c JSON.stringify(spotData) log>",
    "color:blue; font-size: 26px",
    JSON.stringify(spotData)
  );
  try {
    console.log(
      "%c this is the startt of the try in my spot create thunk",
      "color:green; font-size: 26px"
    );
    console.log("XSRF-Token:", Cookies.get("XSRF-TOKEN"));
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spotData),
    });
    console.log("%c response log>", "color:red; font-size: 26px", response);
    console.log(dispatch, "dispatch from spots.js");

    const returnObj = await response.json();
    dispatch(addSpot(returnObj));

    return returnObj;
  } catch (e) {
    console.log("%c e log>", "color:blue; font-size: 26px", e);
    return e;
  }
};

export const fetchSpots = (spotId) => async (dispatch) => {
  if (!spotId) {
    const res = await fetch("/api/spots");
    const spots = await res.json();
    dispatch(loadSpots(spots));

    return res;
  } else {
    const res = await fetch(`/api/spots/${spotId}`);
    const spot = await res.json();
    // console.log(
    //   "%c spot id given to the fetch spots func, else triggered, this is the spot from fetch>",
    //   "color:blue; font-size: 26px",
    //   spot
    // );
    dispatch(loadOne(spot));
    return res;
  }
};

const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case ADD_SPOT: {
      // console.log(
      //   "%c ADD_SPOT called in spots reducer, state, actuin>",
      //   "color:red; font-size: 26px",
      //   state,
      //   action
      // );
      newState = { ...state };
      newState[action.spotData.id] = action.spotData;

      return newState;
    }

    case LOAD_ONE: {
      newState = { ...state };
      // console.log(
      //   "%c LOAD ONE CALLED, action.spot>",
      //   "color:green; font-size: 26px",
      //   action
      // );
      newState[action.payload.id] = action.payload;

      return newState;
    }
    case LOAD_SPOTS: {
      // console.log(
      //   "%c LOAD_SPOTS called, action log>",
      //   "color:blue; font-size: 26px",
      //   action
      // );
      newState = { ...state };
      action.payload.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }

    default:
      return state;
  }
};

export default spotsReducer;
