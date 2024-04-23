import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchSpots } from "../../store/spots";

function Spots() {
  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log(isLoaded);
    dispatch(fetchSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <div id="spots">
      <></>
      <img
        src="https://res.cloudinary.com/dvnr49gnx/image/upload/v1713558531/123photo-86634_xf73wh.jpg"
        alt=""
      />
    </div>
  );
}

export default Spots;
