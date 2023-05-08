import React from 'react';
import { useParams } from 'react-router-dom'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { useState, useEffect } from "react";

const RemotePagination = ({ data, columns, loading, page, sizePerPage, onTableChange, totalSize, defaultSorted }) => (
  <div>
    <BootstrapTable
      bootstrap4
      remote={ {
        filter: true,
        pagination: true,
        sort: true,
        cellEdit: false
      } }
      keyField="id"
      loading={ loading }
      data={ data }
      columns={ columns }
      striped
      hover
      defaultSorted={defaultSorted}
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      filter={ filterFactory() }
      onTableChange={ onTableChange }
    />
  </div>
);

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
  }, [projectId])

  const columns = [{
    dataField: 'id',
    text: 'User ID',
    filter: textFilter(),
    sort: true
  }, {
    dataField: 'name',
    text: 'User Name',
    filter: textFilter(),
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

  const onTableChange = (type, newState) => {
    //TODO [BW] - Convert the following async to be global and assume the purpose of the initial getData async above
    const getData = async (newState) => {
      try {
        let endpoint_uri = `/api/users?project_id=`+projectId+`&page=`+newState.page+`&page_size=`+newState.sizePerPage+`&sort=`+newState.sortField+`&sort_type=`+newState.sortOrder
        for(const filter in newState.filters){
          if(newState.filters[filter].filterType==='DATE'){
            if(newState.filters[filter].filterVal.date){
              let d = JSON.stringify(newState.filters[filter].filterVal.date)
              d = d.slice(1,11)
              const filterVal = [newState.filters[filter].filterVal.comparator, d]
              endpoint_uri+= `&`+filter+`=`+filterVal
            }
          }
          else{
            const filterVal = newState.filters[filter].filterVal
            endpoint_uri+= `&`+filter+`=`+filterVal
          }
          
        }
        const response = await fetch(
          endpoint_uri
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData);
        setError(null);
      } catch(err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }  
    }
    getData(newState)
    }

  return (
    !loading && !error &&
      <div>
        <RemotePagination
          loading={ loading }
          data={ data.data }
          columns={ columns } 
          page={ data.current_page }
          sizePerPage={ data.per_page }
          totalSize={ data.total }
          defaultSorted={defaultSorted}
          onTableChange={ onTableChange }
        />
      </div>
  );
}