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
    this.state = { directory: null };
    this.setDirectory = this.setDirectory.bind(this);
    this.onBrowseClicked = this.onBrowseClicked.bind(this);
  }
  setDirectory(path) {
    this.setState({directory: path});
  }
  async onBrowseClicked() {
    const result = await window.electron.showDialog({properties: ['openDirectory']});
    if (!result.canceled) {
      this.setDirectory(result.filePaths[0]);
    }
  }
  render() {
    return (
      <div className="page-view">
        <Form fluid>
          <Form.Group controlId="project-name">
            <Form.ControlLabel>Project Name</Form.ControlLabel>
            <Form.Control name="name" />
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
              <Button appearance="primary">Create</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    );
  }
}


