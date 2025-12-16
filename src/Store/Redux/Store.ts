import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import appReducer from "@Store/Redux/Slice";
import sanitizeMiddleware from "./sanitizeMiddleware";

const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // temporarily ignore common register paths during migration; sanitizeMiddleware will
        // remove functions and replace them with serializable references.
        ignoredActionPaths: [
          "payload.register",
          "register",
          "payload.__fnRef",
          "payload.*.__fnRef",
        ],
      },
    }).prepend(sanitizeMiddleware),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
