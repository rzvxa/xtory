import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Profile from './Profile';
import { BrowserRouter, Route } from "react-router-dom";

import 'rsuite/dist/rsuite.min.css'
import './index.css'

import {
  CustomProvider,
  Sidenav,
  Sidebar,
  Nav,
  Navbar,
  Dropdown,
  IconButton
} from 'rsuite';

import {
  Dashboard,
  Project,
  ArrowLeftLine,
  ArrowRightLine,
  ChangeList,
  Peoples,
  Message,
  Model,
  Gear,
  Branch
} from '@rsuite/icons';

import Container from 'rsuite/Container';
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';

import * as serviceWorker from './serviceWorker';

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: '#34c3ff',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
};

const renderSettingsButton = (props, ref) => {
  return (
    <IconButton {...props} ref={ref} icon={<Gear />} circle appearance="subtle"/>
  );
};

const Ggg = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  return (
    <div className="main-container sidebar-page">
      <Container>
        <div>
          <Sidebar
            className='main-sidebar'
            width={expanded ? 260 : 56}
            collapsible
          >

            <Sidenav.Header>
              <div style={headerStyles}>
                <Project />
                <span style={{ marginLeft: 18 }}> XTORY</span>
              </div>
            </Sidenav.Header>
            <Sidenav
              className='scroll-enabled'
              expanded={expanded}
              defaultOpenKeys={['3', '4']}
              activeKey={activeKey}
              onSelect={setActiveKey}
            >
              <Sidenav.Body>
                <Nav>
                  <Dropdown placement="rightStart" eventKey="1" title="Projects" icon={<Dashboard />}>
                    <Dropdown.Item eventKey="1-1">New</Dropdown.Item>
                    <Dropdown.Item eventKey="1-2">Open</Dropdown.Item>
                    <Dropdown.Item eventKey="1-3">Save</Dropdown.Item>
                    <Dropdown.Item eventKey="1-4">Export</Dropdown.Item>
                    <Dropdown.Menu eventKey="1-5" className="submenu" title="Open Recent Projecs">
                      <Dropdown.Item eventKey="1-5-1">XXX</Dropdown.Item>
                      <Dropdown.Item eventKey="1-5-2">YYY</Dropdown.Item>
                      <Dropdown.Item eventKey="1-5-3">ZZZ</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Nav.Item eventKey="2" icon={<Branch />}>
                    Flows
                  </Nav.Item>
                  <Nav.Item eventKey="3" icon={<Project />}>
                    Zones
                  </Nav.Item>
                  <Nav.Item eventKey="4" icon={<Peoples />}>
                    Characters
                  </Nav.Item>
                  <Nav.Item eventKey="5" icon={<Message />}>
                    Conversations
                  </Nav.Item>
                  <Nav.Item eventKey="6" icon={<ChangeList />}>
                    Variables
                  </Nav.Item>
                  <Nav.Item eventKey="7" icon={<Model />}>
                    Objects
                  </Nav.Item>
                </Nav>
              </Sidenav.Body>
            </Sidenav>
            <Navbar appearance="subtle">
              <Navbar.Body>
                <Nav>
                  <Dropdown
                    placement="topStart"
                    trigger="click"
                    renderToggle={renderSettingsButton}
                  >
                    <Dropdown.Item>License</Dropdown.Item>
                    <Dropdown.Item>GitHub</Dropdown.Item>
                    <Dropdown.Item>Send Feedback</Dropdown.Item>
                    <Dropdown.Item>Report a Bug</Dropdown.Item>
                  </Dropdown>
                </Nav>
            
                <Nav pullRight>
                  <Nav.Item onClick={() => setExpanded(!expanded)} style={{ width: 56, textAlign: 'center' }}>
                    {expanded ? <ArrowLeftLine /> : <ArrowRightLine />}
                </Nav.Item>
              </Nav>
            </Navbar.Body>
          </Navbar>
          </Sidebar>
        </div>
        <Container>
           <Header>
             <h2>Page Title</h2>
           </Header>
           <Content>Content</Content>
        </Container>
      </Container>
    </div>
  );
};
ReactDOM.render(
  <CustomProvider theme="dark">
    <Ggg />
  </CustomProvider>,
  document.getElementById('root')
);

//     const [expanded, setExpanded] = React.useState(true);
//     const [activeKey, setActiveKey] = React.useState('1');
// ReactDOM.render(
//   <React.StrictMode>
//      <BrowserRouter>
//     <div style={{ width: 240 }}>
//       <Toggle
//         onChange={setExpanded}
//         checked={expanded}
//         checkedChildren="Expand"
//         unCheckedChildren="Collapse"
//       />
//       <hr />
//       <Sidenav
//         expanded={expanded}
//         defaultOpenKeys={['3', '4']}
//         activeKey={activeKey}
//         onSelect={setActiveKey}
//       >
//         <Sidenav.Body>
//           <Nav>
//             <Nav.Item eventKey="1" icon={<Dashboard />}>
//               Dashboard
//             </Nav.Item>
//             <Nav.Item eventKey="2" icon={<Project />}>
//               User Group
//             </Nav.Item>
//             <Dropdown placement="rightStart" eventKey="3" title="Advanced" icon={<Image />}>
//               <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
//               <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
//               <Dropdown.Item eventKey="3-3">Loyalty</Dropdown.Item>
//               <Dropdown.Item eventKey="3-4">Visit Depth</Dropdown.Item>
//             </Dropdown>
//             <Dropdown placement="rightStart" eventKey="4" title="Settings" icon={<Gear />}>
//               <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
//               <Dropdown.Item eventKey="4-2">Channels</Dropdown.Item>
//               <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
//               <Dropdown.Menu eventKey="4-5" title="Custom Action">
//                 <Dropdown.Item eventKey="4-5-1">Action Name</Dropdown.Item>
//                 <Dropdown.Item eventKey="4-5-2">Action Params</Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </Nav>
//         </Sidenav.Body>
//       </Sidenav>
//     </div>
//         <div className="App">
//           <Route path="/" exact component={App} />
//           <Route path="/Profile" exact component={Profile} />
//         </div>
//       </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
