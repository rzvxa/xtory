import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home'
import NewProject from './Project/new';
import OpenProject from './Project/open';
import ExportProject from './Project/export';
import FlowEditor from './Flow/flow-editor';
import Variables from './Variables/variables';
import Settings from './Settings/settings';
import { BrowserRouter, Route, Link } from "react-router-dom";

import './index.less'

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
  Close,
} from '@rsuite/icons';

import Container from 'rsuite/Container';

import * as serviceWorker from './serviceWorker';

const renderSettingsButton = (props, ref) => {
  return (
    <IconButton {...props} ref={ref} icon={<Gear />} circle appearance="subtle"/>
  );
};

const AliveRoute = (props, ref) => {
  const { path, children, ...rest } = props;
  return (
    <Route 
      path={path}
      children={({ match, ...rest }) => {
        return(
          <div style={{display: match ? 'block' : 'none'}}>
            {children}
          </div>
        );
      }}
    />
  );
};

const MenuLink = React.forwardRef((props, ref) => {
  const { href, as, ...rest } = props;
  return (
    <Link ref={ref} {...rest} to={href} />
  );
});

const createInstance = () => {
  return {
    func: null,
    save: function(f) {
      this.func = f;
    },
    restore: function(context) {
      this.func && this.func(context);
    }
  }
}

const DynamicSubFlowRouting = (props) => {
  const { openSubFlows, projectTree, openSubFlow } = props;
  const [ instances, setInstances ] = React.useState({});
  const createRoutes = (subFlow) => {
    const { route } = subFlow;
    if (instances[route] === undefined) {
      instances[route] = createInstance();
      setInstances(instances);
    }
    return (
      <AliveRoute path={`/Flow/${route}`}>
        <FlowEditor
          data={{type: "conv"}}
          projectTree={projectTree}
          openSubFlow={openSubFlow}
          instance={instances[route]}/>
      </AliveRoute>
    )
  };
  return openSubFlows.map(createRoutes);
};

const CreateSubFlowMenuItems = (props) => {
  const { items, setPageTitle, onClose } = props;
  if (items.length === 0) {
    return (
      <Dropdown.Item disabled>
        No Open Sub Flow
      </Dropdown.Item>
    );
  }
  const getTypeIcon = (type) => {
   switch (type) {
     case 'conv':
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
      <div>
        <Dropdown.Item
          eventKey="2-2-1"
          onClick={setPageTitle(item.name)}
          icon={getTypeIcon(item.type)}
          as={MenuLink}
          href={`/Flow/${item.route}`}>
          {item.name}
        </Dropdown.Item>
          <IconButton
            size="xs"
            icon={<Close/>}
            onClick={() => onClose(item)}/>
      </div>
    );
  };
  console.log(items)
  return items.map(createMenuItem);
};

class App extends React.Component {
  constructor(props) {
    super(props);
    const default_path = "C:\\Users\\ali\\Documents\\xtory_test";
    const default_state = [
        {name: "I've Said NO!", type: 'conv', route: 'conv/ive_said_no', path: `${default_path}\\Conversations\\ive_said_no.conv`},
        {name: "Killing in the Name", type: 'quest', route: 'quest/killing_in_the_name', path: `${default_path}\\Conversations\\ive_said_no.conv`},
        {name: "Some Kind of Sub-Story", type: 'story', route: 'story/some_kind_of_sub_story', path: `${default_path}\\Stories\\some_kind_of_sub_story.story`},
      ];
    this.state = {
      projectPath: default_path,
      pageTitle: "Welcome",
      openSubFlows: [],
      projectTree: undefined,
      expanded: true,
      activeKey: '1',
      overviewState: createInstance(),
    };
    this.setPageTitle = this.setPageTitle.bind(this);
    this.updateProjectTree = this.updateProjectTree.bind(this);
    this.closeSubFlow = this.closeSubFlow.bind(this);
    this.openSubFlow = this.openSubFlow.bind(this);
    window.electron.onProjectUpdate(this.updateProjectTree);
    this.updateProjectTree();
  
  }
  setPageTitle(title) {
    return () => {
      this.setState({pageTitle: title});
    };
  }
  async updateProjectTree() {
    const buildProjectTree = async () => {
      const raw = await window.electron.projectTree(this.state.projectPath);
      const Decorate = (input, path) => {
        if (path === undefined) {
          path = '';
        }
        const tree = [];
        for (let i in input) {
          let iPath = path;
          if (iPath !== '') {
            iPath += '/';
          }
          iPath += i;
          // console.log(`raw[i] => ${input[i]} and i => ${i}`);
          const branch = {
            label: i,
            value: iPath,
          }
          if (input[i] !== null) {
            branch['children'] = Decorate(input[i], iPath);
          }
          tree.push(branch);
        }
        return tree;
      };
      return Decorate(raw);
    }
    const tree = await buildProjectTree();
    this.setState({projectTree: tree});
  }
  closeSubFlow(flow) {
    for (let i = 0; i < this.state.openSubFlows.length; ++i) {
      if (this.state.openSubFlows[i] === flow) {
        this.state.openSubFlows.splice(i, 1);
        if (flow.name === this.state.pageTitle) {
          this.state.pageTitle = '';
        }
        this.setState({
          openSubFlows: this.state.openSubFlows,
          pageTitle: this.stae.pageTitle,
        });
      }
    }
  }
  openSubFlow(path) {
    const type = path.split('.').pop()
    this.state.openSubFlows.push({
      name: 'unnamed',
      type: type,
      route: path,
      path: path
    });
    this.setState({openSubFlows: this.state.openSubFlows})
  }
  render() {
    return (
      <React.StrictMode>
        <BrowserRouter>
          <div className="main-container sidebar-page">
            <Container>
              <div>
                <Sidebar
                  className='main-sidebar'
                  width={this.state.expanded ? 260 : 56}
                  collapsible
                >

                  <Sidenav.Header>
                    <Link to="/">
                      <div className='sidenav-header' onClick={() => {
                        this.setState({expanded: true});
                        this.setState({activeKey: '-1'});
                      }}>
                        <div />
                        <span style={{ marginLeft: 18 }}> XTORY</span>
                      </div>
                    </Link>
                  </Sidenav.Header>
                  <Sidenav
                    className='scroll-enabled'
                    expanded={this.state.expanded}
                    defaultOpenKeys={['2', '2-2']}
                    activeKey={this.state.activeKey}
                    onSelect={ (k) => { if (k === "IGNORE") return ;this.setState({activeKey: k}); }}
                  >
                    <Sidenav.Body>
                      <Nav>
                        <Dropdown placement="rightStart" eventKey="1" title="Project" icon={<Dashboard />}>
                          <Dropdown.Item eventKey="1-1" onClick={this.setPageTitle('New')} as={MenuLink} href="/Project/New">New</Dropdown.Item>
                          <Dropdown.Item eventKey="1-2" onClick={this.setPageTitle('Open')} as={MenuLink} href="/Project/Open">Open</Dropdown.Item>
                          <Dropdown.Item eventKey="IGNORE">Save</Dropdown.Item>
                          <Dropdown.Item eventKey="1-3" onClick={this.setPageTitle('Export')} as={MenuLink} href="/Project/Export">Export</Dropdown.Item>
                          <Dropdown.Menu eventKey="1-4" className="submenu" title="Open Recent Projecs">
                            <Dropdown.Item eventKey="1-4-1">XXX</Dropdown.Item>
                            <Dropdown.Item eventKey="1-4-2">YYY</Dropdown.Item>
                            <Dropdown.Item eventKey="1-4-3">ZZZ</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown placement="rightStart" eventKey="2" title="Flow" icon={<Branch />}>
                          <Dropdown.Item eventKey="2-1" onClick={this.setPageTitle('Overview')} as={MenuLink} href="/Flow/Overview">Overview</Dropdown.Item>
                          <Dropdown.Menu eventKey="2-2" className="submenu" title="Open Sub Flows">
                            <CreateSubFlowMenuItems items={this.state.openSubFlows} setPageTitle={this.setPageTitle} onClose={this.closeSubFlow}/>
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
                        <Nav.Item onClick={this.setPageTitle('Variables')} as={MenuLink} eventKey="6" icon={<ChangeList />} href="/Variables">
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
                          <Dropdown.Item>Send Feedback</Dropdown.Item>
                          <Dropdown.Item>Report a Bug</Dropdown.Item>
                          <Dropdown.Item onClick={this.setPageTitle('Settings')} as={MenuLink} href="/Settings">Settings</Dropdown.Item>
                        </Dropdown>
                      </Nav>

                      <Nav pullRight>
                        <Nav.Item onClick={() => this.setState({expanded: !this.state.expanded})} style={{ width: 56, textAlign: 'center' }}>
                          {this.state.expanded ? <ArrowLeftLine /> : <ArrowRightLine />}
                        </Nav.Item>
                      </Nav>
                    </Navbar.Body>
                  </Navbar>
                </Sidebar>
              </div>
              <Container className="page">
                <Header>
                  <h2>{this.state.pageTitle}</h2>
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
                    <AliveRoute path="/Flow/Overview">
                      <FlowEditor
                        data={{type: "story"}}
                        projectTree={this.state.projectTree}
                        openSubFlow={this.openSubFlow}
                        instance={this.state.overviewState}
                      />
                    </AliveRoute>
                    <DynamicSubFlowRouting
                      openSubFlows={this.state.openSubFlows}
                      openSubFlow={this.openSubFlow}
                      projectTree={this.state.projectTree}
                    />
                    <Route path="/Variables">
                      <Variables/>
                    </Route>
                    <Route path="/Settings">
                      <Settings/>
                    </Route>
                  </div>
                </Content>
              </Container>
            </Container>
          </div>
        </BrowserRouter>
      </React.StrictMode>
    );
  };
}
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
