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
        <img
          id="faviconlogo"
          src={favicon}
          alt="Website Favicon"
          className="favicon"
        />
      </div>

      <ul className="navbar">
        <li>
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
