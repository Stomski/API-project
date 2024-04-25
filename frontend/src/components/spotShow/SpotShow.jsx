import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useEffect, useState } from "react";
import { reviewFetch } from "../../store/reviews";

function SpotShow() {
  const dispatch = useDispatch();

  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector((state) => state.reviews);

  //   console.log(
  //     "%c spots in Spot show jxs>",
  //     "color:blue; font-size: 26px",
  //     spot
  //   );
  //   console.log("%c spotId log>", "color:red; font-size: 26px", spotId);
  console.log(
    "%c Object.values(reviews)",
    "color:blue; font-size: 26px",
    Object.values(reviews)
  );

  useEffect(() => {
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
    dispatch(reviewFetch(spotId));
  }, [dispatch, spotId]);

  return (
    <div className="spotshow">
      {isLoaded && spot && (
        <>
          <h1>{spot.name}</h1>
          {spot.SpotImages.length > 0 && (
            <img
              className="preview-img"
              src={`${spot.SpotImages[0].url}`}
              alt="Spot Preview"
            />
          )}

          <h3>Price: {`${spot.price}`} </h3>
          <h2>REVIEWS</h2>

          {Object.values(reviews).length && (
            <div>
              {Object.values(reviews).map((review, index) => (
                <div key={index}>
                  <p></p>
                  <p>{review.review}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default SpotShow;
