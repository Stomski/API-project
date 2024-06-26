import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

export const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

export const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  payload: reviews,
});

export const deleteReviewThunk = (reviewId, spotId) => async (dispatch) => {
  await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  await dispatch(reviewFetch(spotId));
  return;
};

export const addReviewThunk = (review, user) => async (dispatch) => {
  // console.log("%c review log>", "color:blue; font-size: 26px", review);
  const response = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });
  const responseJson = await response.json();

  console.log(
    "%c responseJson in addreview thunk>",
    "color:yellow; font-size: 26px",
    responseJson
  );

  responseJson.User = user;

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

      newState[action.payload.id] = action.payload;
      return newState;
    case LOAD_REVIEWS:
      newState = {};
      console.log(
        "%c action in load reviews>",
        "color:red; font-size: 26px",
        action
      );

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
