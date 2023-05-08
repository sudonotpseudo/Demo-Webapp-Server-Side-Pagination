import React from 'react';
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import { useState, useEffect } from "react";
import Users from './users';
import Files from './files';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



export default function Project() {
  const {projectId} = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `/api/users?project_id=`+projectId+`&page=1&page_size=5&sort=id&sort_type=asc`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        console.log(actualData.data)
        setData(actualData);
        setError(null);
      } catch(err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }  
    }
    getData()
  }, [])

  const buttonFormatter = (cell, row, rowIndex, formatExtraData) => { 
    const projectPath = '/project/'+row.id;
    return ( 
    <Link to={projectPath}>
      <button> 
        Go to {row.name}
    </button> 
    </Link>
    ); 
  }

  const columns = [{
    dataField: 'id',
    text: 'User ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'User Name',
    sort: true,
  }, {
    dataField: 'email',
    text: 'Email',
    filter: textFilter(),
    sort: true,
  },
  ];

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  return (
    !loading &&
    <Tabs
      defaultActiveKey="users"
      id="project_tabs"
      className="mb-3"
    >
      <Tab eventKey="users" title="Users">
        <Users/>
      </Tab>
      <Tab eventKey="files" title="Files">
        <Files/>
      </Tab>
    </Tabs>
  );
}