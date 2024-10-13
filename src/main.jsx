import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './Layout.jsx';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import LandingPage from './Elements/LandingPage.jsx';
import Aboutus from './Elements/Aboutus.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<LandingPage />} />  {/* Renders LandingPage at '/' */}
      <Route path='about' element={<Aboutus />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
