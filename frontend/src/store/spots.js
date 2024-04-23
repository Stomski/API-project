const LOAD_SPOTS = "LOAD_SPOTS";

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
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
    console.log("%c spot log>", "color:blue; font-size: 26px", spot);
    // dispatch(loadSpotById(spot));
    return res;
  }
};

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      console.log(
        "%c LOAD_SPOTS called, action log>",
        "color:blue; font-size: 26px",
        action
      );
      const newState = { ...state };
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
