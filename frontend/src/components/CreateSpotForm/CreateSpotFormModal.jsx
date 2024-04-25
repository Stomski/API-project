import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { useNavigate, useParams } from "react-router-dom";
import { fetchSpots } from "../../store/spots";
import { spotCreateThunk } from "../../store/spots";
//import CSS

function CreateSpotModal() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageObj, setImageObj] = useState({
    previewImageUrl: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [updatebool, setUpdateBool] = useState(false);
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spotById);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    //i need to populate the edit spot form with the current info if this is a edit functionality, and keep it empty for just create
    dispatch(fetchSpots(spotId)).then(() => {});
    if (!spotId) {
      setUpdateBool(false);
    }
    if (spotId) {
      setUpdateBool(true);
    }
    dispatch(fetchSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spotData = {
      country,
      address,
      city,
      state,
      description,
      name,
      lat: 1,
      lng: 1,
      price: parseInt(price),
    };
    setErrors({});

    const thunkReply = await dispatch(spotCreateThunk(spotData));

    console.log("%c thunkReply log>", "color:red; font-size: 26px", thunkReply);
    console.log(updatebool, spot, closeModal);
    //example from signupformModal.jsx
    // if (password === confirmPassword) {
    //   setErrors({});
    //   return dispatch(
    //     sessionActions.signup({
    //       email,
    //       username,
    //       firstName,
    //       lastName,
    //       password,
    //     })
    //   )
    //     .then(closeModal)
    //     .catch(async (res) => {
    //       const data = await res.json();
    //       if (data?.errors) {
    //         setErrors(data.errors);
    //       }
    //     });
    // }
    // return setErrors({
    //   confirmPassword:
    //     "Confirm Password field must be the same as the Password field",
    // });

    navigate(`/spots/${thunkReply.id}`);
  };

  return (
    <div className="modal-container">
      <h1>Create A Spot!</h1>

      {isLoaded && (
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <h2 className="form-heading">Where&apos;s your place located?</h2>
            <p className="subtitle">
              Guests will only get your exact address once they have booked a
              reservation.
            </p>
            <label className="input-label" htmlFor="country">
              Country
            </label>{" "}
            <p className="form-errors">{errors.country}</p>
            <input
              className="form-input"
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label className="input-label" htmlFor="address">
              Street Address
            </label>
            <p className="form-errors">{errors.address}</p>
            <input
              className="form-input"
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label className="input-label" htmlFor="city">
              City
            </label>
            <p className="form-errors">{errors.city}</p>
            <input
              className="form-input"
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label className="input-label" htmlFor="state">
              State
            </label>
            <p className="form-errors">{errors.state}</p>
            <input
              className="form-input"
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="form-div">
            <h2 className="form-heading">Describe your place to guests</h2>
            <p className="subtitle">
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <p className="form-errors">{errors.description}</p>
            <input
              id="spotdescription"
              className="form-input"
              type="textarea"
              placeholder="Please write at least 30 characters"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/* input */}
          </div>
          <div className="form-div">
            <h2 className="form-heading">Create a title for your spot</h2>
            <p className="subtitle">
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special!
            </p>
            <label className="form-label" htmlFor="name"></label>
            <p className="form-errors">{errors.name}</p>
            <input
              className="form-input"
              id="name"
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* input */}
          </div>
          <div className="form-div">
            <h2 className="form-heading">Set a base price for your spot</h2>
            <p className="subtitle">
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <p className="form-errors">{errors.price}</p>
            <input
              className="form-input"
              id="number"
              type="number"
              placeholder="Price per night"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-section">{/* input */}</div>
          <div className="form-div">
            <h2 className="form-heading">
              Liven Up Your Spot With Some Photos!
            </h2>
            <p className="subtitle">
              Submit a link to at least one photo to publish your spot.
            </p>
            <label className="form-label" htmlFor="prev-img">
              Preview Image
            </label>
            <p className="form-errors">{errors.SpotImages}</p>
            <input
              className="form-input"
              id="prev-img"
              type="text"
              placeholder="Preview Image URL"
              value={imageObj.previewImageUrl}
              onChange={(e) =>
                setImageObj((prevState) => ({
                  ...prevState,
                  previewImageUrl: e.target.value,
                }))
              }
            />
            <label className="form-label" htmlFor="img2">
              Image 2 (optional)
            </label>
            <input
              className="form-input"
              id="img2"
              type="text"
              placeholder="Image URL"
              value={imageObj.image2Url}
              onChange={(e) =>
                setImageObj((prevState) => ({
                  ...prevState,
                  image2Url: e.target.value,
                }))
              }
            />
            <label className="form-label" htmlFor="img3">
              Image 3 (optional)
            </label>
            <input
              className="form-input"
              id="img3"
              type="text"
              placeholder="Image URL"
              value={imageObj.image3Url}
              onChange={(e) =>
                setImageObj((prevState) => ({
                  ...prevState,
                  image3Url: e.target.value,
                }))
              }
            />
            <label className="form-label" htmlFor="img4">
              Image 4 (optional)
            </label>
            <input
              className="form-input"
              id="img4"
              type="text"
              placeholder="Image URL"
              value={imageObj.image4Url}
              onChange={(e) =>
                setImageObj((prevState) => ({
                  ...prevState,
                  image4Url: e.target.value,
                }))
              }
            />
            <label className="form-label" htmlFor="img5">
              Image 5 (optional)
            </label>
            <input
              className="form-input"
              id="img5"
              type="text"
              placeholder="Image URL"
              value={imageObj.image5Url}
              onChange={(e) =>
                setImageObj((prevState) => ({
                  ...prevState,
                  image5Url: e.target.value,
                }))
              }
            />
            {/* input */}
          </div>
          <div className="submit-button-Div">
            <button type="submit">Submit Spot!</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateSpotModal;
