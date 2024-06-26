import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import "./Spots.css";

function Spots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div id="spots-box">
      {isLoaded &&
        Object.values(spots).map(
          (spot) =>
            spot.id &&
            !spot.Owner && (
              <div key={spot.id} className="spot-tile spot-name-tooltip">
                <NavLink
                  className="spot-tile"
                  key={spot.id}
                  to={`/spots/${spot.id}`}
                >
                  <div id="spots-indv">
                    <img
                      className="preview-img"
                      key={spot.id}
                      src={spot.previewImage}
                      alt={`${spot.name} Preview Image`}
                    />
                    <h2
                      key={spot.name}
                      className="spot-name spot-name-tooltip-text"
                    >
                      {spot.name}
                    </h2>

                    <div id="location-star-avg">
                      {spot.avgRating > 1 ? (
                        <>
                          <span>&#9733;</span>
                          <span>{spot.avgRating.toFixed(1)}</span>
                        </>
                      ) : (
                        <>NEW!</>
                      )}
                    </div>
                    <p
                      key={spot.city}
                      className="spot-location"
                    >{`${spot.city}, ${spot.state}`}</p>

                    <p key={spot.rating} className="spot-rating"></p>
                    <p key={spot.price} className="spot-price">
                      {" "}
                      <b>{`$${spot.price}`}</b> / night
                    </p>
                  </div>
                </NavLink>
              </div>
            )
        )}
    </div>
  );
}

export default Spots;
