import React from 'react';
import { 
    Link,
    Outlet,
    useLoaderData,
    useOutlet,
    } from "react-router-dom";
import { getContacts } from "../contacts";
import ProjectsList from "./projects_list"
  
export async function loader() {
    const contacts = await getContacts();
    return { contacts };
  }

export default function Root() {
    const { contacts } = useLoaderData();

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