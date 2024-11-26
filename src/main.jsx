import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./Layout.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LandingPage from "./Elements/LandingPage.jsx";
import Aboutus from "./Elements/Aboutus.jsx";
import Editor from "./Elements/Editors.jsx";

import { v4 as uuidV4 } from "uuid";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<LandingPage />} />
      <Route path="about" element={<Aboutus />} />
      <Route
        path="doc-editing"
        element={<Navigate to={`/api/new/FluxDocs/${uuidV4()}`} />}
      />
      <Route path="api/new/FluxDocs/:id" element={<Editor />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);