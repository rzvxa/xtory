import React from "react";
import Form from 'rsuite/Form';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Button from 'rsuite/Button';
import { BrowseInput, TextAreaAccepter } from '../UI/kit';

export default class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projectName: '', directory: null };
    this.onProjectNameChanged = this.onProjectNameChanged.bind(this);
    this.setDirectory = this.setDirectory.bind(this);
    this.onBrowseClicked = this.onBrowseClicked.bind(this);
    this.onCreateProjectClicked = this.onCreateProjectClicked.bind(this);
  }
  onProjectNameChanged(value) {
    this.setState({ projectName: value });
  }
  setDirectory(path) {
    this.setState({directory: path});
  }
  async onBrowseClicked() {
    const result = await window.electron.showDialog({properties: ['openDirectory']});
    if (!result.canceled) {
      const dir = result.filePaths[0];
      this.setDirectory(dir);
    }
  }
  onCreateProjectClicked() {
    const name = this.state.projectName;
    const dir = this.state.directory;
    let path = dir;
    if (!dir.endsWith(name)) {
      path += '/' + name;
    }
  }
  render() {
    return (
      <div className="page-view">
        <Form fluid>
          <Form.Group controlId="project-name">
            <Form.ControlLabel>Project Name</Form.ControlLabel>
            <Form.Control
              name="name"
              onChange={this.onProjectNameChanged}
              value={this.state.projectName}
            />
          </Form.Group>
          <Form.Group controlId="project-path">
            <Form.ControlLabel>Directory</Form.ControlLabel>
            <BrowseInput
              style={{width: "100%"}}
              onClick={this.onBrowseClicked}
              value={this.state.directory}
            />
          </Form.Group>
          <Form.Group controlId="project-description">
            <Form.ControlLabel>Description</Form.ControlLabel>
            <Form.Control rows={5} name="textarea" accepter={TextAreaAccepter} />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" onClick={this.onCreateProjectClicked}>Create</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    );
  }
}


