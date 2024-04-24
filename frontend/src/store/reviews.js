const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";

export const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  payload: reviews,
});

export const reviewFetch = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  const responseJson = await response.json();
  console.log(
    "%c responseJson log>",
    "color:blue; font-size: 26px",
    responseJson
  );
  dispatch(loadReviews(responseJson));
};

function reviewReducer(state = {}, action) {
  let newState;
  switch (action.type) {
    case LOAD_REVIEWS:
      newState = {};

      // console.log(
      //   "%c action.payload.reviews log>",
      //   "color:blue; font-size: 26px",
      //   action.payload.Reviews
      // );
      // console.log(
      //   "%c LOAD_REVIEWS called in reviewReducer, good work dev>",
      //   "color:blue; font-size: 26px",
      //   state
      // );
      action.payload.Reviews.forEach((review) => {
        newState[review.id] = review;
      });

      // console.log("%c newState log>", "color:blue; font-size: 26px", newState);
      return newState;
    default:
      return state;
  }
}

export default reviewReducer;
