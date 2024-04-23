import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation/Navigation-bonus";
import * as sessionActions from "./store/session";
import { Modal } from "./context/Modal";
import Spots from "./components/SpotsIndex/Spots";
import SpotShow from "./components/spotShow";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <div className="navflex">
      <div></div>
      <div className="navbuttons">
        <Modal />
        <Navigation isLoaded={isLoaded} className="navbar" />
        {isLoaded && <Outlet />}
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout className="navbar" />,
    children: [
      {
        path: "/",
        element: <Spots />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotShow />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
