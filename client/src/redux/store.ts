import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// ✅ Step 1: combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// ✅ Step 2: persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // VERY IMPORTANT
};

// ✅ Step 3: wrap root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Step 4: create store
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);













