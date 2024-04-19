import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import { ModalProvider, Modal } from "./context/Modal"; //comment this back in!!!!

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

const Carrot = () => (
  <div style={{ color: "orange", fontSize: "100px" }}>
    <img
      src="https://res.cloudinary.com/dvnr49gnx/image/upload/v1713558531/123photo-86634_xf73wh.jpg"
      alt=""
    />
  </div>
);

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      my
      <Provider store={store}>
        <App />
        {<Carrot />}
        {<Modal />}
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
