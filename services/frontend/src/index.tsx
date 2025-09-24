import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NileshI18nProvider } from "./_nilesh/i18n/Nilesh18n";
import { AuthProvider } from "./app/modules/auth/core/Auth";
import { ReactQueryDevtools } from 'react-query/devtools';
import { setupAxios } from "./app/modules/auth/core/AuthHelpers";
import axios from 'axios';
import * as AppRoutes from './app/routing/AppRoutes'
import { ThemeProvider } from "./_nilesh/context/ThemeContext";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

setupAxios(axios);
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>

      <ThemeProvider>
        <NileshI18nProvider>
          <AuthProvider>
            <AppRoutes.AppRoutes />
            {/* <h1 className="text-4xl font-bold text-blue-600">Hello Nilesh</h1> */}
          </AuthProvider>
        </NileshI18nProvider>
        <ReactQueryDevtools initialIsOpen={false} />

      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
