import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.ts";
import "./features/handleSessionCheck.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SkeletonTheme } from "react-loading-skeleton";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./features/stripe";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <QueryClientProvider client={queryClient}>
                <SkeletonTheme baseColor="#222" highlightColor="#333">
                  <App />
                </SkeletonTheme>
                {import.meta.env.DEV && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </QueryClientProvider>
            </PersistGate>
          </Provider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Elements>
  </StrictMode>,
);
