import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useEffect, useState } from "react";
import { loadReviews, reviewFetch } from "../../store/reviews";

function SpotShow() {
  const dispatch = useDispatch();

  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const [isLoaded, setIsLoaded] = useState(false);
  //   console.log(
  //     "%c spots in Spot show jxs>",
  //     "color:blue; font-size: 26px",
  //     spot
  //   );
  //   console.log("%c spotId log>", "color:red; font-size: 26px", spotId);

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
        </>
      )}
    </div>
  );
}
export default SpotShow;
