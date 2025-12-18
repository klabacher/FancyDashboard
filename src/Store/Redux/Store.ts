// Store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./Slice"; // Ajuste o caminho conforme seu projeto
import MainSliceReducer from "./MainGridSlice"; // Ajuste o caminho conforme seu projeto

const rootReducer = combineReducers({
  app: appReducer,
  MainGrid: MainSliceReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Necessário para ignorar erros de serialização do redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Exportar os tipos para uso nos componentes e hooks customizados
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
