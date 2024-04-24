import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";
import favicon from "../../../src/favicon.ico";

function Navigation({ isLoaded }) {
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
        {sessionUser && <NavLink to={"/"}>Create a Spot</NavLink>}
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
