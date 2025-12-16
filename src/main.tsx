import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@Store/Redux/Store";
import App from "./App";
import "@Assets/Global.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// DEV: dispatch a sample action that contains a function to verify the sanitizeMiddleware
// if (process.env.NODE_ENV !== "production") {
//   const register2 = (key: string) => {
//     // this simulates an external function that internally dispatches REGISTER
//     store.dispatch({ type: "REGISTER", key });
//   };

//   // This action intentionally contains a function and would previously trigger the serializable middleware warning

//   store.dispatch({
//     type: "DEV_ACTION/TEST_REGISTER_FN",
//     payload: { register: register2 as unknown },
//   });
// }
