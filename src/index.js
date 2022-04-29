import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home'
import NewProject from './Project/new';
import OpenProject from './Project/open';
import ExportProject from './Project/export';
import OverviewFlow from './Flow/overview';
import Variables from './Variables/variables';
import { BrowserRouter, Route, Link } from "react-router-dom";
import {
  Provider as KeepAliveProvider,
  KeepAlive,
} from 'react-keep-alive';

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

import * as serviceWorker from './serviceWorker';

// const headerStyles = {
//   padding: 18,
//   fontSize: 16,
//   height: 56,
//   background: '#34c3ff',
//   color: ' #fff',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden'
// };

const renderSettingsButton = (props, ref) => {
  return (
    <IconButton {...props} ref={ref} icon={<Gear />} circle appearance="subtle"/>
  );
};

const MenuLink = React.forwardRef((props, ref) => {
  const { href, as, ...rest } = props;
  return (
    <Link ref={ref} {...rest} to={href} />
  );
});

const Ggg = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  return (
    <React.StrictMode>
      <BrowserRouter>
        <KeepAliveProvider>
          <div className="main-container sidebar-page">
            <Container>
              <div>
                <Sidebar
                  className='main-sidebar'
                  width={expanded ? 260 : 56}
                  collapsible
                >

                  <Sidenav.Header>
                    <Link to="/">
                      <div className='sidenav-header' onClick={() => {
                        setExpanded(true);
                        setActiveKey('-1');
                      }}>
                        <div />
                        <span style={{ marginLeft: 18 }}> XTORY</span>
                      </div>
                    </Link>
                  </Sidenav.Header>
                  <Sidenav
                    className='scroll-enabled'
                    expanded={expanded}
                    defaultOpenKeys={['3', '4']}
                    activeKey={activeKey}
                    onSelect={ (k) => { if (k === "IGNORE") return ;setActiveKey(k); }}
                  >
                    <Sidenav.Body>
                      <Nav>
                        <Dropdown placement="rightStart" eventKey="1" title="Project" icon={<Dashboard />}>
                      <Dropdown.Item eventKey="1-1" as={MenuLink} href="/Project/New">New</Dropdown.Item>
                          <Dropdown.Item eventKey="1-2" as={MenuLink} href="/Project/Open">Open</Dropdown.Item>
                          <Dropdown.Item eventKey="IGNORE">Save</Dropdown.Item>
                          <Dropdown.Item eventKey="1-3" as={MenuLink} href="/Project/Export">Export</Dropdown.Item>
                          <Dropdown.Menu eventKey="1-4" className="submenu" title="Open Recent Projecs">
                            <Dropdown.Item eventKey="1-4-1">XXX</Dropdown.Item>
                            <Dropdown.Item eventKey="1-4-2">YYY</Dropdown.Item>
                            <Dropdown.Item eventKey="1-4-3">ZZZ</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown placement="rightStart" eventKey="2" title="Flow" icon={<Branch />}>
                          <Dropdown.Item eventKey="2-1" as={MenuLink} href="/Flow/Overview">Overview</Dropdown.Item>
                          <Dropdown.Item eventKey="2-2" as={MenuLink} href="/Flow/SubFlows">Sub Flows</Dropdown.Item>
                        </Dropdown>
                        <Nav.Item eventKey="3" icon={<Project />}>
                          Zones
                        </Nav.Item>
                        <Nav.Item eventKey="4" icon={<Peoples />}>
                          Characters
                        </Nav.Item>
                        <Nav.Item eventKey="5" icon={<Message />}>
                          Conversations
                        </Nav.Item>
                        <Nav.Item as={MenuLink} eventKey="6" icon={<ChangeList />} href="/Variables">
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
                <div className="router-view">
                  <Route path="/" exact component={Home} />
                  <Route path="/Project/New">
                      <NewProject/>
                  </Route>
                  <Route path="/Project/Open">
                      <OpenProject/>
                  </Route>
                  <Route path="/Project/Export">
                      <ExportProject/>
                  </Route>
                  <Route path="/Flow/Overview">
                    <KeepAlive name="Overview">
                      <OverviewFlow/>
                    </KeepAlive>
                  </Route>
                  <Route path="/Variables">
                    <KeepAlive name="Variables">
                      <Variables/>
                    </KeepAlive>
                  </Route>
                </div>
              </Container>
            </Container>
          </div>
        </KeepAliveProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};
ReactDOM.render(
  <CustomProvider theme="dark">
    <Ggg />
  </CustomProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
