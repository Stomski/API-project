import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOneSpot, fetchSpots } from "../../store/spots";
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
  const [sessionUserOwns, setSessionUserOwns] = useState(false);
  const [spotState, setSpotState] = useState(spot);
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  // console.log(
  //   "%c alreadyReviewed log>",
  //   "color:red; font-size: 26px",
  //   alreadyReviewed
  // );
  // console.log("%c spot in Spot show jxs>", "color:blue; font-size: 26px", spot);
  //   console.log("%c spotId log>", "color:red; font-size: 26px", spotId);
  // console.log(
  //   "%c Object.values(reviews)",
  //   "color:blue; font-size: 26px",
  //   Object.values(reviews)
  // );

  const getMonthYear = (review) => {
    // console.log(review.createdAt, "review from get month year");
    const splitArray = review.createdAt.split("-");
    const year = splitArray[0];

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
    // console.log(month, year);
    const returnString = `${month}, ${year}`;
    return returnString;
  };

  const findReviewAverage = (reviews) => {
    let count = 0;
    Object.values(reviews).forEach((review) => {
      count += review.stars;
    });
    let avgStars = count / Object.values(reviews).length;
    return avgStars;
  };

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  // useEffect(() => {
  //   dispatch(fetchOneSpot(spotId)).then(setIsLoaded(true));
  // }, [spotId, isLoaded]);

  useEffect(() => {
    // console.log(
    //   "%c  spots in use effect called in spots.jsx>",
    //   "color:blue; font-size: 26px",
    //   spots
    // );
    dispatch(fetchSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOneSpot(spotId));
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
    dispatch(reviewFetch(spotId));
  }, [dispatch, spotId, isLoaded]);

  useEffect(() => {
    if (sessionUser && spot && sessionUser.id === spot.ownerId) {
      setSessionUserOwns(true);
    }
    if (reviews && Object.values(reviews).length > 0 && isLoaded === true) {
      Object.values(reviews).forEach((review) => {
        // console.log("%c review log>", "color:red; font-size: 26px", review);
        if (sessionUser && review.userId === sessionUser.id) {
          setAlreadyReviewed(true);
        }
      });
    }
    if (sessionUser && isLoaded === true && sessionUser.id === spot.ownerId) {
      // console.log(
      //   "%c alreadyReviewed ihn my session user conditional",
      //   "color:blue; font-size: 26px",
      //   alreadyReviewed
      // );
    }
    if (spot && isLoaded && !spot.SpotImages) {
      spot.SpotImages = [];
    }

    const newSpot = { ...spot };
    console.log(spotState);
    setSpotState(newSpot);
  }, [sessionUser, dispatch, spotId, reviews, spot]);

  return (
    <div className="spotshow">
      {isLoaded && spot && !spot.errors ? (
        <>
          {/* {console.log(
            "%c spot log> at top of return spotsshow",
            "color:red; font-size: 26px",
            spot
          )} */}
          <h1>{spot.name}</h1>
          <div className="spot-details">
            <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
          </div>

          {spot.SpotImages && spot.SpotImages.length === 0 && (
            <div id="spot-show-image-container">
              <div className="preview-image-div">
                <img
                  key={spot.id}
                  className="main-preview-img"
                  src={spot.previewImage}
                  alt={`Spot Preview`}
                />
              </div>

              <div id="spot-show-small-images">
                {spot.SpotImages.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    className="small-preview-img"
                    src={image.url}
                    alt={`Spot Preview ${index + 1}`}
                  />
                ))}
                {spot.SpotImages.length < 5 &&
                  Array.from({ length: 4 - spot.SpotImages.length }).map(
                    (_, index) => (
                      <img
                        key={`placeholder-${index}`}
                        className="small-preview-img"
                        src="https://res.cloudinary.com/dvnr49gnx/image/upload/v1714267658/Screenshot_2024-04-27_at_7.27.34_PM_nwfoup.png" // Replace with your placeholder image URL
                        alt={`Placeholder Image ${index + 1}`}
                      />
                    )
                  )}
              </div>
            </div>
          )}
          {spot.SpotImages && spot.SpotImages.length > 0 && (
            <div id="spot-show-image-container">
              {/* {console.log(
                "%c spot log> spot-show-image-containerw",
                "color:red; font-size: 26px",
                spot
              )} */}
              <div className="preview-image-div">
                {spot.SpotImages.slice(0, 1).map((image, index) => (
                  <img
                    key={index}
                    className="main-preview-img"
                    src={image.url}
                    alt={`Spot Preview ${index + 1}`}
                  />
                ))}
                {/* {console.log(
                  "%c spot log> BELOW preview imabe div",
                  "color:red; font-size: 26px",
                  spot
                )} */}
              </div>

              <div id="spot-show-small-images">
                {spot.SpotImages.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    className="small-preview-img"
                    src={image.url}
                    alt={`Spot Preview ${index + 1}`}
                  />
                ))}
                {spot.SpotImages.length < 5 &&
                  Array.from({ length: 5 - spot.SpotImages.length }).map(
                    (_, index) => (
                      <img
                        key={`placeholder-${index}`}
                        className="small-preview-img"
                        src="https://res.cloudinary.com/dvnr49gnx/image/upload/v1714267658/Screenshot_2024-04-27_at_7.27.34_PM_nwfoup.png" // Replace with your placeholder image URL
                        alt={`Placeholder Image ${index + 1}`}
                      />
                    )
                  )}
              </div>
            </div>
          )}

          <div className="below-images-div">
            {/* {console.log("%c spot log>", "color:blue; font-size: 26px", spot)} */}

            {spot && spot.Owner ? (
              <div className="review-text-div">
                <h2>
                  Hosted by: {`${spot.Owner.firstName} ${spot.Owner.lastName}`}{" "}
                </h2>
                <p className="spotshow-details">{`${spot.description}`}</p>
              </div>
            ) : (
              <div className="review-text-div">
                <h2>
                  Hosted by:{" "}
                  {`${singleSpot.Owner.firstName} ${singleSpot.Owner.lastName}`}{" "}
                </h2>
                <p className="spotshow-details">{`${spot.description}`}</p>
              </div>
            )}

            <div className="review-info-div">
              {reviews && Object.values(reviews) > 0 ? (
                <>
                  <div className="stars-show">
                    {findReviewAverage(reviews)} &#9733;
                  </div>
                </>
              ) : (
                <p>New!</p>
              )}

              <div className="reserve-button-div">
                <p>{spot.price} /night!</p>
                <button id="reserve-button-id" onClick={handleReserveClick}>
                  Reserve now!
                </button>
              </div>
            </div>
          </div>

          <div className="reviews-div">
            <div className="review-header-div">
              <div id="review-header-avg-stars">
                {reviews && Object.values(reviews).length > 0 && (
                  <div className="stars-render-above-reviews">
                    <p> &#9733;</p>
                    <p className="star-label">{":   "}</p>
                    {findReviewAverage(reviews)}
                  </div>
                )}
              </div>
              <div id="review-header-num-reviews">
                {reviews && Object.values(reviews).length > 0 && (
                  <>
                    {Object.values(reviews).length === 1 && "1 Review"}
                    {Object.values(reviews).length > 1 &&
                      `${Object.values(reviews).length} Reviews`}
                  </>
                )}
              </div>
            </div>

            <div className="create-review-link">
              {sessionUser && alreadyReviewed === false && !sessionUserOwns && (
                <OpenModalButton
                  navigate={navigate}
                  buttonText="Create a Review!"
                  modalComponent={<CreateReviewModal spotId={spotId} />}
                />
              )}
            </div>
            {sessionUser &&
              sessionUser.id !== spot.ownerId &&
              (!reviews || Object.values(reviews).length < 1) && (
                <h3>be the first to subit a review!</h3>
              )}
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

                  {Object.values(reviews)
                    .sort((a, b) => b.id - a.id)
                    .map((review, index) => (
                      <div key={index} className="review-individual">
                        <div className="review-name">
                          {review.User.firstName}
                        </div>
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
                              {/* <OpenModalButton
                              navigate={navigate}
                              buttonText="edit your Review!"
                              modalComponent={
                                <CreateReviewModal spotId={spot.id} />
                              }
                            /> */}

                              <button onClick={handleReserveClick}>
                                edit your review
                              </button>
                              {/* <OpenModalButton
                              navigate={navigate}
                              buttonText="delete your Review!"
                              modalComponent={
                                <CreateReviewModal spotId={spot.id} />
                              }
                            /> */}
                              <button onClick={handleReserveClick}>
                                Delete your review!
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>
        </>
      ) : (
        <h1>couldnt load spot</h1>
      )}
    </div>
  );
}
export default SpotShow;
