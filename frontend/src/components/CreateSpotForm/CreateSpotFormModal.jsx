import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

// import { useParams } from "react-router-dom";
import { fetchSpots, updateSpotThunk } from "../../store/spots";
import { spotCreateThunk } from "../../store/spots";
import "./CreateSpotFormModal.css";

function CreateSpotModal({ navigate, spotId }) {
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
  // const { spotId } = useParams();
  // const spot = useSelector((state) => state.spots[spotId]);

  // console.log("%c spot log>", "color:orange; font-size: 26px", spot);
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  useEffect(() => {
    if (spotId) {
      dispatch(fetchSpots(spotId)).then(async (spot) => {
        setAddress(spot.address);
        setCity(spot.city);
        setState(spot.state);
        setCountry(spot.country);
        setName(spot.name);
        setDescription(spot.description);
        setPrice(spot.price);
        setUpdateBool(true);
        setIsLoaded(true);
      });
    } else {
      dispatch(fetchSpots()).then(() => {
        setAddress("");
        setCity("");
        setState("");
        setCountry("");
        setName("");
        setDescription("");
        setPrice(0);
        setUpdateBool(false);
        setIsLoaded(true);
      });
    }
  }, [dispatch, spotId, updatebool]);

  useEffect(() => {
    console.log("Errors updated:", errors);
  }, [errors]);

  const createErrorObj = () => {
    console.log(
      "%c errors log at top of create error object func line 61>",
      "color:yellow; font-size: 26px",
      errors
    );

    const errorObj = {};
    console.log(
      "%c errorOBJ log at top of create error object func line 61>",
      "color:yellow; font-size: 26px",
      errorObj
    );
    if (name === "") errorObj.name = "Name is required";
    if (city === "") errorObj.city = "City is required";
    if (state === "") errorObj.state = "State is required";
    if (country === "") errorObj.country = "Country is required";
    if (address === "") errorObj.address = "Street address is required";
    if (description.length < 30)
      errorObj.description = "Description must be at least 30 characters";
    if (price <= 0) errorObj.price = "Price per day must be a positive number";
    if (imageObj.previewImageUrl === "")
      errorObj.spotImages = "At least one image is required";
    return errorObj;
  };

  const handleSubmit = async (e) => {
    console.log("%c handleSubmit TOP OF CREATE", "color:blue; font-size: 26px");

    e.preventDefault();

    const errObj = createErrorObj();
    setErrors(errObj);
    console.log(errors);
    if (!Object.values(errors).length) {
      console.log(
        "%c handleSubmit TOP OF IFObject.values(errors)",
        "color:blue; font-size: 26px"
      );
      console.log(
        "%c Object.values(errors) log at top of ifs in handle>",
        "color:red; font-size: 26px",
        Object.values(errors)
      );
      if (
        name !== "" &&
        city !== "" &&
        state !== "" &&
        country !== "" &&
        address !== "" &&
        imageObj.previewImageUrl !== ""
      ) {
        if (updatebool === false) {
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
          const response = await dispatch(spotCreateThunk(spotData, imageObj));

          console.log(
            "%c response fromt spot create thunj",
            "color:yellow; font-size: 26px",
            response
          );
          console.log(
            "%c response.id log>",
            "color:blue; font-size: 26px",
            response.id
          );
          navigate(`/spots/${response.newSpot.id}`);
          closeModal();
        } else if (updatebool === true) {
          console.log("updating");
          const spotData = {
            id: spotId,
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

          const response = await dispatch(updateSpotThunk(spotData, imageObj));

          console.log(
            "%c response from update spot thunk>",
            "color:teal; font-size: 26px",
            response
          );
          navigate(`/spots/${spotData.id}`);
          closeModal();
        }
      }
    }
  };

  return (
    <div className="modal-container">
      {!isLoaded && <h1>loading</h1>}
      {updatebool && isLoaded && <h1>Edit Your Spot!</h1>}
      {!updatebool && isLoaded && <h1>Create A Spot!</h1>}

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
            <p className="form-errors">{errors.spotImages}</p>
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
