import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotsByUserThunk } from "../../store/spots";
import { NavLink } from "react-router-dom";
const ManageSpots = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  console.log("%c spots log>", "color:red; font-size: 26px", spots);
  useEffect(() => {
    dispatch(spotsByUserThunk(sessionUser.id)).then(setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <h1>THESE YO SPOTS YO!</h1>
      <section className="manage-spots-div">
        {isLoaded &&
          spots &&
          Object.values(spots).map(
            (spot) =>
              spot.id &&
              !spot.Owner && (
                <div key={spot.id} className="spot-tile">
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
                      <h2 key={spot.name} className="spot-name">
                        {spot.name}
                      </h2>
                      <div id="location-reviews"></div>
                      <p
                        key={spot.city}
                        className="spot-location"
                      >{`${spot.city}, ${spot.state}`}</p>

                      <p key={spot.rating} className="spot-rating"></p>
                      <p key={spot.price} className="spot-price">
                        {" "}
                        <b key={spot.price}>{`$${spot.price}`}</b> / night
                      </p>
                    </div>
                  </NavLink>
                  <div className="owner-buttons">
                    <button>Edit Spot</button>
                    <button>Delete Spot</button>
                  </div>
                </div>
              )
          )}
      </section>
    </>
  );
};

export default ManageSpots;
