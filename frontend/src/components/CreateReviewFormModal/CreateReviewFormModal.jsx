import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "../CreateReviewFormModal/CreateReviewFormModal.css";
import { useState } from "react";
import { addReviewThunk } from "../../store/reviews";

function CreateReviewModal({ spotId }) {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "%c handleSubmit log>",
      "color:teal; font-size: 26px",
      handleSubmit
    );
    const reviewObj = { review, stars, spotId };
    setErrors({});
    // navigate(`/spots/${thunkReply.id}`);
    dispatch(addReviewThunk(reviewObj));
    closeModal();
  };

  return (
    <div className="modal-container">
      <h1>Create A Review!</h1>

      <form id="review-form" onSubmit={handleSubmit}>
        <p className="form-errors">{errors && errors.message}</p>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          placeholder="Leave your review here..."
        />
        <div className="stars">
          <div className="star-map">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={value <= stars ? "star-filled" : "empty-star"}
                onClick={() => setStars(value)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <p id="stars-label">Stars</p>
        </div>

        <button
          className="submit-modal"
          id="review-submit"
          type="submit"
          disabled={review.length < 10 || stars === 0}
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default CreateReviewModal;
