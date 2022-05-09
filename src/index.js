import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home'
import NewProject from './Project/new';
import OpenProject from './Project/open';
import ExportProject from './Project/export';
import OverviewFlow from './Flow/overview';
import FlowEditor from './Flow/flowEditor';
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
  IconButton,
  Header,
  Content,
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
  Branch,
  AbTest,
  Tree,
} from '@rsuite/icons';

import Container from 'rsuite/Container';

import * as serviceWorker from './serviceWorker';

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

const DynamicSubFlowRouting = (props) => {
  const { openSubFlows } = props;
  const createRoutes = (subFlow) => {
    const { route } = subFlow;
    return (
      <Route path={`/Flow/${route}`}>
        <KeepAlive name={`/Flow/${route}`}>
          <FlowEditor />
        </KeepAlive>
      </Route>
    )
  };
  return openSubFlows.map(createRoutes);
};

const CreateSubFlowMenuItems = (props) => {
  const { items, setPageTitle } = props;
  if (items.length === 0) {
    return (
      <Dropdown.Item disabled>
        No Open Sub Flow
      </Dropdown.Item>
    );
  }
  const getTypeIcon = (type) => {
   switch (type) {
     case 'conversation':
       return <Message/>
     case 'quest':
       return <AbTest/>
     case 'story':
       return <Tree/>

     default:
       return <div/>

   }
  };
  const createMenuItem = (item) => {
    return (
      <Dropdown.Item
        eventKey="2-2-1"
        onClick={setPageTitle(item.name)}
        icon={getTypeIcon(item.type)}
        as={MenuLink}
        href={`/Flow/${item.route}`}>
        {item.name}
      </Dropdown.Item>
    );
  };
  return items.map(createMenuItem);
};

const App = () => {
  const [projectPath, setProjectPath] = React.useState("C:\\Users\\ali\\Documents\\xtory_test");
  const [pageTitle, setPageTitle_Internal] = React.useState("Welcome");
  const setPageTitle = (title) => () => setPageTitle_Internal(title);
  const default_state = [
      {name: "I've Said NO!", type: 'conversation', route: 'conv/ive_said_no', path: `${projectPath}\\Conversations\\ive_said_no.conv`},
      {name: "Killing in the Name", type: 'quest', route: 'quest/killing_in_the_name', path: `${projectPath}\\Conversations\\ive_said_no.conv`},
      {name: "Some Kind of Sub-Story", type: 'story', route: 'story/some_kind_of_sub_story', path: `${projectPath}\\Stories\\some_kind_of_sub_story.story`},
    ];

  const [openSubFlows, setOpenSubFlows] = React.useState([]);

  const ProjectTree = () => {
    console.log(projectPath);
  };


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
                    defaultOpenKeys={['2', '2-2']}
                    activeKey={activeKey}
                    onSelect={ (k) => { if (k === "IGNORE") return ;setActiveKey(k); }}
                  >
                    <Sidenav.Body>
                      <Nav>
                        <Dropdown placement="rightStart" eventKey="1" title="Project" icon={<Dashboard />}>
                          <Dropdown.Item eventKey="1-1" onClick={setPageTitle('New')} as={MenuLink} href="/Project/New">New</Dropdown.Item>
                          <Dropdown.Item eventKey="1-2" onClick={setPageTitle('Open')} as={MenuLink} href="/Project/Open">Open</Dropdown.Item>
                          <Dropdown.Item eventKey="IGNORE">Save</Dropdown.Item>
                          <Dropdown.Item eventKey="1-3" onClick={setPageTitle('Export')} as={MenuLink} href="/Project/Export">Export</Dropdown.Item>
                          <Dropdown.Menu eventKey="1-4" className="submenu" title="Open Recent Projecs">
                            <Dropdown.Item eventKey="1-4-1">XXX</Dropdown.Item>
                            <Dropdown.Item eventKey="1-4-2">YYY</Dropdown.Item>
                            <Dropdown.Item eventKey="1-4-3">ZZZ</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown placement="rightStart" eventKey="2" title="Flow" icon={<Branch />}>
                          <Dropdown.Item eventKey="2-1" onClick={setPageTitle('Overview')} as={MenuLink} href="/Flow/Overview">Overview</Dropdown.Item>
                          <Dropdown.Menu eventKey="2-2" className="submenu" title="Sub Flows">
                            <CreateSubFlowMenuItems items={openSubFlows} setPageTitle={setPageTitle}/>
                          </Dropdown.Menu>
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
                        <Nav.Item onClick={setPageTitle('Variables')} as={MenuLink} eventKey="6" icon={<ChangeList />} href="/Variables">
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
              <Container className="page">
                <Header>
                  <h2>{pageTitle}</h2>
                </Header>
                <Content>
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
                    <DynamicSubFlowRouting openSubFlows={openSubFlows} />
                    <Route path="/Variables">
                      <KeepAlive name="Variables">
                        <Variables/>
                      </KeepAlive>
                    </Route>
                  </div>
                </Content>
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
    <App />
  </CustomProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
