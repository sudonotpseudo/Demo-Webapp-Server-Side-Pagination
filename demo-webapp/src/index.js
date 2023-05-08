import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ErrorPage from "./error-page";
import Project from "./routes/project";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';



import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
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
