import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotsByUserThunk } from "../../store/spots";
const ManageSpots = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  console.log("%c spots log>", "color:red; font-size: 26px", spots);
  useEffect(() => {
    dispatch(spotsByUserThunk(sessionUser.id));
  }, [dispatch]);

  return (
    <>
      <h1>THESE YO SPOTS YO!</h1>
      <section className="manage-spots-div">{}</section>
    </>
  );
};

export default ManageSpots;
