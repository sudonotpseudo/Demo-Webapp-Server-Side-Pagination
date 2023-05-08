import React from 'react';
import { 
    Link,
    Outlet,
    useOutlet,
    } from "react-router-dom";
import ProjectsList from "./projects_list"
  


export default function Root() {
    return (
      <>
        <div id="sidebar">
          <h1>Demo Web App</h1>
          <div>
            <Link to="/">
                <button type="button">
                    Home
                </button>
            </Link>
          </div>
          <nav>
            <ul>
                <li>
                    <Link to="/">
                        Home
                    </Link>
                </li>
            </ul>
          </nav>
        </div>
        <div id="detail">
            {useOutlet() == null ? (
                <ProjectsList/>
            ) : (
                <Outlet/>
            )}
        </div>
      </>
    );
  }