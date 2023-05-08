import React from 'react';
import { 
    Link,
    Outlet,
    useOutlet,
    } from "react-router-dom";
import ProjectsList from "./projects_list"
import {ReactComponent as Home} from '../house.svg';
  


export default function Root() {
    return (
      <>
        <div id="sidebar">
          <h1>Demo Web App</h1>
          <nav>
          {useOutlet() == null ? (
            <div></div>
          ) : (
            <ul>
                <li>
                    <Link to="/">
                      Home
                      <Home className='home'/>
                    </Link>
                </li>
            </ul>
          )}
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