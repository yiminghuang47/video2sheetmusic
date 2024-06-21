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
import YoutubeUpload from "./components/YoutubeUpload";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Upload />,
      },
    ],
  },
  {
    path: "/youtube-upload",
    element: <App />,
    children: [
      {
        path: "/youtube-upload",
        element: <YoutubeUpload />,
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