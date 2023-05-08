import React from 'react';
import { useParams } from 'react-router-dom'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import { useState, useEffect } from "react";



export default function Project() {
  const {projectId} = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `/api/files?project_id=`+projectId+`&page=1&page_size=5&sort=id&sort_type=asc`
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

  const columns = [{
    dataField: 'id',
    text: 'File ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'File Name',
    sort: true,
  }, {
    dataField: 'type',
    text: 'Type',
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
      <div>
        <h1>User List</h1>
        <h2>Page {data.current_page}</h2>
        <h2>Total Count {data.total}</h2>
        <BootstrapTable 
          bootstrap4
          loading={ loading }
          keyField='id' 
          data={ data.data } 
          columns={ columns } 
          striped
          hover
          defaultSorted={defaultSorted}
          filter={ filterFactory() }
          overlay={ overlayFactory({ spinner: true, styles: { overlay: (base) => ({...base, background: 'rgba(255, 0, 0, 0.5)'}) } }) }
          >
          </BootstrapTable>
      </div>
  );
}