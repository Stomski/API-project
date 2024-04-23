const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_ONE = "spots/LOAD_ONE";

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

export const loadOne = (spot) => ({
  type: LOAD_ONE,
  payload: spot,
});

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
