// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";

function CreateReviewModal({ navigate }) {
  console.log(
    "%c CreateReviewModal log>",
    "color:red; font-size: 26px",
    CreateReviewModal
  );
  console.log("%c navigate log>", "color:blue; font-size: 26px", navigate);
  //   const [review, setReview] = useState("");
  //   const [stars, setStars] = useState(0);
  //   const dispatch = useDispatch();
  //   const { closeModal } = useModal();

  return (
    <div className="modal-container">
      <h1>Create A Review!</h1>
    </div>
  );
}

export default CreateReviewModal;
