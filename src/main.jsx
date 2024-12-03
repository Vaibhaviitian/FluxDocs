import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./Layout.jsx";
import "./index.css";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LandingPage from "./Elements/LandingPage.jsx";
import Aboutus from "./Elements/Aboutus.jsx";
import Editor from "./Elements/Editors.jsx";
import SignInPage from "./Elements/SignIn.jsx";
import SignUpPage from "./Elements/SignUp.jsx";

import { v4 as uuidV4 } from "uuid";

// Define all routes in a single array
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "about", element: <Aboutus /> },
      {
        path: "doc-editing",
        element: <Navigate to={`/api/new/FluxDocs/${uuidV4()}`} />,
      },
      { path: "api/new/FluxDocs/:id", element: <Editor /> },
    ],
  },
  {
    path: "login",
    element: <SignInPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
