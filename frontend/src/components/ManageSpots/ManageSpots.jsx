import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotsByUserThunk } from "../../store/spots";
import { NavLink } from "react-router-dom";
import DeleteSpotModal from "./DeleteSpotModal";
import OpenModalButton from "../OpenModalButton";
import { useNavigate } from "react-router-dom";
import CreateSpotModal from "../CreateSpotForm/CreateSpotFormModal";
import "./ManageSpots.css";

const ManageSpots = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const allSpots = useSelector((state) => state.spots);
  const [isLoaded, setIsLoaded] = useState(false);
  const spots = Object.values(allSpots).filter(
    (spot) => spot.ownerId === sessionUser.id
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("%c spots log>", "color:red; font-size: 26px", spots);
  useEffect(() => {
    dispatch(spotsByUserThunk(sessionUser.id)).then(setIsLoaded(true));
  }, [dispatch, sessionUser]);

  return (
    <>
      <h1>Manage Spots!</h1>
      <section className="manage-spots-div">
        {isLoaded && spots && spots.length ? (
          Object.values(spots).map(
            (spot) =>
              spot.id &&
              !spot.Owner && (
                <div key={spot.id} className="spot-tile">
                  <NavLink
                    className="spotlink"
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
                    <OpenModalButton
                      navigate={navigate}
                      buttonText="edit spot"
                      modalComponent={
                        <CreateSpotModal navigate={navigate} spotId={spot.id} />
                      }
                    />
                    <OpenModalButton
                      navigate={navigate}
                      buttonText="Delete Spot"
                      modalComponent={<DeleteSpotModal spotId={spot.id} />}
                    />
                  </div>
                </div>
              )
          )
        ) : (
          <div className="create-spot-link">
            {sessionUser && (
              <OpenModalButton
                navigate={navigate}
                buttonText="No Spots yet, Create one!"
                modalComponent={<CreateSpotModal navigate={navigate} />}
              />
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default ManageSpots;
