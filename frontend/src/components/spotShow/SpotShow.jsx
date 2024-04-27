import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useEffect, useState } from "react";
import { reviewFetch } from "../../store/reviews";
import CreateReviewModal from "../CreateReviewFormModal/CreateReviewFormModal";
// import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";

function SpotShow({ navigate }) {
  const dispatch = useDispatch();

  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector((state) => state.reviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  // console.log(
  //   "%c alreadyReviewed log>",
  //   "color:red; font-size: 26px",
  //   alreadyReviewed
  // );
  console.log(
    "%c spots in Spot show jxs>",
    "color:blue; font-size: 26px",
    spot
  );
  //   console.log("%c spotId log>", "color:red; font-size: 26px", spotId);
  // console.log(
  //   "%c Object.values(reviews)",
  //   "color:blue; font-size: 26px",
  //   Object.values(reviews)
  // );

  useEffect(() => {
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
    dispatch(reviewFetch(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (reviews && Object.values(reviews).length > 0) {
      Object.values(reviews).forEach((review) => {
        // console.log(
        //   "%c review log>",
        //   "color:red; font-size: 26px",
        //   review.userId,
        //   sessionUser.id
        // );
        if (review.userId === sessionUser.id) {
          setAlreadyReviewed(true);
        }
      });
    }
    if (sessionUser.id === spot.ownerId) {
      console.log(
        "%c alreadyReviewed ihn my session user conditional",
        "color:blue; font-size: 26px",
        alreadyReviewed
      );
    }
  }, [sessionUser, dispatch, spotId, reviews]);

  return (
    <div className="spotshow">
      {isLoaded && spot && !spot.errors ? (
        <>
          <h1>{spot.name}</h1>
          <div className="spot-details">
            <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
          </div>
          {spot.SpotImages.length > 0 && (
            <img
              className="preview-img"
              src={`${spot.SpotImages[0].url}`}
              alt="Spot Preview"
            />
          )}

          <h3>
            Hosted by: {`${spot.Owner.firstName} ${spot.Owner.lastName}`}{" "}
          </h3>
          <p className="spotshow-details">{`${spot.description}`}</p>

          <div className="reviews-div">
            <h2>REVIEWS</h2>

            {reviews &&
              Object.values(reviews) &&
              Object.values(reviews).length > 0 && (
                <div>
                  {Object.values(reviews).map((review, index) => (
                    <div key={index}>
                      <p></p>
                      <p>{review.review}</p>
                    </div>
                  ))}
                </div>
              )}

            <div className="review-button-div"></div>

            <div className="create-review-link">
              {sessionUser && alreadyReviewed === false ? (
                <OpenModalButton
                  navigate={navigate}
                  buttonText="Create a Review!"
                  modalComponent={<CreateReviewModal spotId={spot.id} />}
                />
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </>
      ) : (
        <h1>couldnt load spot</h1>
      )}
    </div>
  );
}
export default SpotShow;
