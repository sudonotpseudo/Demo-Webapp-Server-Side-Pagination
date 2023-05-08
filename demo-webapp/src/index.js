import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorPage from "./error-page";
import Contact from "./routes/contact";
import Project from "./routes/project";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';



import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root, { loader as rootLoader } from "./routes/root";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "project/:projectId",
        element: <Project />,
      }
    ],
  },
]);

const render_root = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  render_root
);
