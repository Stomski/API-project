import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [formReady, setFormReady] = useState(false);

  const createErrorObj = () => {
    const errorObj = {};

    if (username.length === "") errorObj.username = "Username is required";
    if (email === "") errorObj.city = "Email is required";
    if (firstName === "") errorObj.state = "First Name is required";
    if (lastName === "") errorObj.country = "Last Name is required";
    if (password === "") errorObj.address = "Password is required";
    if (confirmPassword === "") setErrors(errorObj);

    return errorObj;
  };

  useEffect(() => {
    const newErrorObj = createErrorObj();
    if (
      username.length < 4 ||
      password.length < 6 ||
      (newErrorObj && Object.values(newErrorObj).length)
    ) {
      setFormReady(false);
    } else {
      setFormReady(true);
    }
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({});
      setErrors(createErrorObj());

      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(async (res) => {
          if (res.ok) {
            await closeModal();
          } else {
            const data = await res.json();
            if (data?.errors) {
              setErrors(data.errors);
            }
          }
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="login-modal-container">
      <div className="form-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          <button type="submit" disabled={!formReady}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
