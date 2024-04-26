import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";

export const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

export const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  payload: reviews,
});

export const addReviewThunk = (review) => async (dispatch) => {
  // console.log("%c review log>", "color:blue; font-size: 26px", review);
  const response = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });
  const responseJson = await response.json();

  // console.log(
  //   "%c responseJson in addreview thunk>",
  //   "color:yellow; font-size: 26px",
  //   responseJson
  // );

  dispatch(addReview(responseJson));
  return responseJson;
};

export const reviewFetch = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  const responseJson = await response.json();
  // console.log(
  //   "%c responseJson in review fetch log>",
  //   "color:blue; font-size: 26px",
  //   responseJson
  // );
  dispatch(loadReviews(responseJson));
};

function reviewReducer(state = {}, action) {
  let newState;
  switch (action.type) {
    case ADD_REVIEW:
      newState = { ...state };

      // console.log("%c newState log>", "color:green; font-size: 26px", newState);

      // console.log(
      //   "%c action in addreview called log>",
      //   "color:orange; font-size: 26px",
      //   action
      // );
      newState[action.payload.id] = action.payload;
      return newState;
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
      if (action.payload.Reviews) {
        action.payload.Reviews.forEach((review) => {
          newState[review.id] = review;
        });
      }

      // console.log("%c newState log>", "color:blue; font-size: 26px", newState);
      return newState;
    default:
      return state;
  }
}

export default reviewReducer;
