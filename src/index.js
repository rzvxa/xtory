import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home'
import NewProject from './Project/new';
import OpenProject from './Project/open';
import { BrowserRouter, Route, Link } from "react-router-dom";

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
              <div style={headerStyles}>
                <Project />
                <span style={{ marginLeft: 18 }}> XTORY</span>
              </div>
              </Link>
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
                  <Dropdown placement="rightStart" eventKey="1" title="Project" icon={<Dashboard />}>
                    <Dropdown.Item eventKey="1-1" as={MenuLink} href="/Project/New">New</Dropdown.Item>
                    <Dropdown.Item eventKey="1-2" as={MenuLink} href="/Project/Open">Open</Dropdown.Item>
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
              <div className="router-view">
                <Route path="/" exact component={Home} />
                <Route path="/Project/New" exact component={NewProject} />
                <Route path="/Project/Open" exact component={OpenProject} />
              </div>
          {/* <Header> */}
          {/*   <h2>Page Title</h2> */}
          {/* </Header> */}
          {/* <Content>Content</Content> */}
        </Container>
      </Container>
    </div>
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
