import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import Upload from "./components/Upload";
import About from "./components/About";
import Navbar from "./components/Navbar";
import App from "./App";
import Home from "./components/Home";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/about",
    element: <App />,
    children: [
      {
        path: "/about",
        element: <About />,
      },
    ],
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);