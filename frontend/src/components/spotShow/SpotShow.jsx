import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useEffect, useState } from "react";
import { reviewFetch } from "../../store/reviews";
import CreateReviewModal from "../CreateReviewFormModal/CreateReviewFormModal";
// import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import "./SpotShow.css";

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

  const getMonthYear = (review) => {
    console.log(review.createdAt, "review from get month year");
    const splitArray = review.createdAt.split("-");
    const year = splitArray[0];
    const monthNum = splitArray[1];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[splitArray[1] - 1];
    console.log(month, year);
    const returnString = `${month}, ${year}`;
    return returnString;
  };

  useEffect(() => {
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
    dispatch(reviewFetch(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (reviews && Object.values(reviews).length > 0 && isLoaded === true) {
      Object.values(reviews).forEach((review) => {
        console.log("%c review log>", "color:red; font-size: 26px", review);
        if (sessionUser && review.userId === sessionUser.id) {
          setAlreadyReviewed(true);
        }
      });
    }
    if (sessionUser && isLoaded === true && sessionUser.id === spot.ownerId) {
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
          {spot.SpotImages && spot.SpotImages.length > 0 && (
            <img
              className="preview-img"
              src={`${spot.SpotImages[0].url}`}
              alt="Spot Preview"
            />
          )}

          <h2>
            Hosted by: {`${spot.Owner.firstName} ${spot.Owner.lastName}`}{" "}
          </h2>
          <p className="spotshow-details">{`${spot.description}`}</p>

          <div className="reviews-div">
            <div className="review-header-div">
              <div id="review-header-avg-stars">this is the num stars avg</div>
              <div id="review-header-num-reviews">
                {Object.values(reviews) && Object.values(reviews).length}
                num reviews .length
              </div>
            </div>

            {reviews &&
              Object.values(reviews) &&
              Object.values(reviews).length > 0 && (
                <div className="all-reviews-box">
                  <></>
                  {/**
                   *
                   *
                   *            REVIEW MAP
                   *
                   *
                   */}

                  {Object.values(reviews).map((review, index) => (
                    <div className="review-individual">
                      <div className="review-name">{review.User.firstName}</div>
                      <div className="review-month">
                        {Array.from({ length: review.stars }, (_, i) => (
                          <span key={i}>&#9733;</span>
                        ))}
                        {getMonthYear(review)}
                      </div>
                      <div key={index}>
                        <p>{review.review}</p>
                      </div>
                      <div>
                        {/* {review.id} reviewId {review.userId} review userID{" "}
                        {sessionUser.id} session user ud to left */}

                        {sessionUser && review.userId === sessionUser.id && (
                          <>
                            <OpenModalButton
                              navigate={navigate}
                              buttonText="edit your Review!"
                              modalComponent={
                                <CreateReviewModal spotId={spot.id} />
                              }
                            />
                            <OpenModalButton
                              navigate={navigate}
                              buttonText="delete your Review!"
                              modalComponent={
                                <CreateReviewModal spotId={spot.id} />
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            <div className="review-button-div"></div>

            <div className="create-review-link">
              {sessionUser &&
              alreadyReviewed === false &&
              sessionUser.id !== spotId ? (
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
