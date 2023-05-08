import React from 'react';

import Users from './users';
import Files from './files';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



export default function Project() {
  return (
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