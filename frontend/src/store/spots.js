import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_ONE = "spots/LOAD_ONE";
const ADD_SPOT = "spots/ADD_SPOT";
const GET_USERS_SPOTS = "spots/GET_USERS_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOTS";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const SINGLE_SPOT_STORE = "spots/SINGLE_SPOT_STORE";

export const updateSpot = (spot, imageArray) => ({
  type: UPDATE_SPOT,
  payload: spot,
  imageArray,
});

export const deleteSpot = (spot) => ({
  type: DELETE_SPOT,
  payload: spot,
});

export const addSingleSpot = (spot) => ({
  type: SINGLE_SPOT_STORE,
  payload: spot,
});

export const getSpotsByUser = (spots) => ({
  type: GET_USERS_SPOTS,
  payload: spots,
});

export const addSpot = (spotData, imageObj) => ({
  type: ADD_SPOT,
  spotData,
  imageObj,
});

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

export const loadOne = (spot) => ({
  type: LOAD_ONE,
  payload: spot,
});
export const updateSpotThunk = (spotData, imageObj) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotData.id}`, {
    method: "PUT",
    body: JSON.stringify(spotData),
  });
  const newSpot = await response.json();

  const spotImgs = await Promise.all(
    Object.values(imageObj).map(async (spotUrl) => {
      const spot = { url: spotUrl, preview: false };

      const res = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: "POST",
        body: JSON.stringify(spot),
      });
      return { images: res.json(), spot: newSpot };
    })
  );

  await dispatch(updateSpot(newSpot, spotImgs));

  return { newSpot, spotImgs };
};
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  console.log("this is the top of my delete spot thunk, good work dev", spotId);
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  const resObj = await response.json();

  if (response.status === 200) {
    dispatch(deleteSpot(spotId));
    return resObj;
  } else {
    return "error";
  }
};

export const spotsByUserThunk = () => async (dispatch) => {
  // console.log(
  //   "%c spotsByUserThunk  at the top",
  //   "color:green; font-size: 26px"
  // );
  const response = await csrfFetch("/api/spots/current", {});
  const resJson = await response.json();
  console.log(resJson, "res.json");
  dispatch(loadSpots(Object.values(resJson)));
};

export const spotCreateThunk = (spotData, imageObj) => async (dispatch) => {
  console.log("%c spotCreateThunk called log>", "color:blue; font-size: 26px");
  // console.log(
  //   "%c JSON.stringify(spotData) log>",
  //   "color:blue; font-size: 26px",
  //   JSON.stringify(spotData)
  // );
  try {
    console.log(
      "%c this is the startt of the try in my spot create thunk",
      "color:green; font-size: 26px"
    );

    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spotData),
    });
    // console.log("%c response log>", "color:red; font-size: 26px", response);
    // console.log(dispatch, "dispatch from spots.js");

    const newSpot = await response.json();

    const spotImgs = await Promise.all(
      Object.values(imageObj).map(async (spotUrl) => {
        const spot = { url: spotUrl, preview: false };

        const res = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
          method: "POST",
          body: JSON.stringify(spot),
        });
        return { images: res.json(), spot: newSpot };
      })
    );

    dispatch(addSpot(newSpot, spotImgs));

    return { newSpot, spotImgs };
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
    return spot;
  }
};

export const fetchOneSpot = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  dispatch(addSingleSpot(spot));
  return spot;
};

const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case SINGLE_SPOT_STORE: {
      console.log("%c SINGLE_SPOT_STORE log>", "color:red; font-size: 26px");
      newState = { ...state };
      newState.singleSpot = action.payload;
      return newState;
    }
    case UPDATE_SPOT: {
      newState = { ...state };
      console.log(
        "%c action  in update spot reducerlog>",
        "color:red; font-size: 26px",
        action,
        newState
      );
      newState[action.payload.id] = action.payload;
      newState[action.payload.id].imageArray = action.imageArray;
      return newState;
    }

    case DELETE_SPOT: {
      newState = { ...state };
      console.log(
        "%c action  in delete spot reducerlog>",
        "color:red; font-size: 26px",
        action
      );

      delete newState[action.payload];

      return newState;
    }
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

    case LOAD_SPOTS: {
      // console.log(
      //   "%c LOAD_SPOTS called, action log>",
      //   "color:blue; font-size: 26px",
      //   action.payload
      // );
      newState = { ...state };
      if (action.payload.Spots) {
        console.log("this i think is fucked up");
        action.payload.Spots.forEach((spot) => {
          newState[spot.id] = spot;
        });
        return newState;
      }
      if (action.payload) {
        newState = {};
        action.payload.forEach((spot) => {
          newState[singleSpot][spot.id] = spot;
        });
        return newState;
      }
      break;
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
    default:
      return state;
  }
};

export default spotsReducer;
