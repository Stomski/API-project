// import { useState } from "react";
// import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import "./DeleteSpotModal.css";

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  console.log(spotId, "spotId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpotThunk(spotId));
    closeModal();
    return;
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    dispatch(closeModal());
  };

  return (
    <div className="delete-modal-container">
      <div className="form-container">
        <h1 id="modaltitles">Are You Sure?</h1>

        <button type="submit" onClick={handleSubmit} className="delete">
          yes, delete
        </button>
        <button type="submit" onClick={cancelDelete} className="cancel">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
