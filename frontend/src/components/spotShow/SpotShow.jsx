import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useEffect, useState } from "react";

function SpotShow() {
  const dispatch = useDispatch();

  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log(
    "%c spots in Spot show jxs>",
    "color:blue; font-size: 26px",
    spot
  );
  console.log("%c spotId log>", "color:red; font-size: 26px", spotId);

  useEffect(() => {
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, spotId]);

  return (
    <div className="spotshow">
      {isLoaded && spot && (
        <>
          <h1>testing the new div render</h1>
          <h3>FUCK YES</h3>
        </>
      )}
    </div>
  );
}
export default SpotShow;
