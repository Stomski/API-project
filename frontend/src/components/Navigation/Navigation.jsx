import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded, className }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} className="navbar" />
    </li>
  ) : (
    <>
      <li className="navbar">
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        {/* <NavLink to="/login">Log In</NavLink> */}
      </li>
      <li>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal className="navbar" />}
        />
        {/* <NavLink to="/signup">Sign Up</NavLink> */}
      </li>
    </>
  );

  return (
    <ul className={className}>
      <li>
        <NavLink to="/">Home</NavLink>
        <p>this is ia test</p>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
