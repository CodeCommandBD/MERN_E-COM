"use client";
import { persistor, store } from "@/store/store";
import React, { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Loading from "./Loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClientOnly from "./ClientOnly";

const queryClient = new QueryClient();

// Only load DevTools in development
const isDev = process.env.NODE_ENV === "development";
const ReactQueryDevtools = isDev
  ? React.lazy(() =>
      import("@tanstack/react-query-devtools").then((d) => ({
        default: d.ReactQueryDevtools,
      }))
    )
  : null;

const GlobalProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading></Loading>}>
          <div suppressHydrationWarning={true}>{children}</div>
        </PersistGate>
      </Provider>
      {isDev && isClient && ReactQueryDevtools && (
        <ClientOnly>
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </Suspense>
        </ClientOnly>
      )}
    </QueryClientProvider>
  );
};

export default GlobalProvider;
