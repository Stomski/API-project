import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";
import favicon from "../../../src/favicon.ico";
import OpenModalButton from "../OpenModalButton";
import CreateSpotModal from "../CreateSpotForm";

function Navigation({ isLoaded, navigate }) {
  console.log(
    "%c navigate in navigationjsxlog>",
    "color:blue; font-size: 26px",
    navigate
  );
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="headbar">
      <div id="logodiv">
        <NavLink to="/">
          {" "}
          <img
            id="faviconlogo"
            src={favicon}
            alt="Website Favicon"
            className="favicon"
          />
        </NavLink>
      </div>
      <div className="create-spot-link">
        {sessionUser && (
          <OpenModalButton
            navigate={navigate}
            buttonText="Create a Spot"
            modalComponent={<CreateSpotModal navigate={navigate} />}
          />
        )}
      </div>

      <ul className="navlinksdiv">
        <li id="homebutton">
          <NavLink to="/">Home</NavLink>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
