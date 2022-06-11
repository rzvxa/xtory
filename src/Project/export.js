import React from "react";
import Form from 'rsuite/Form';
import Input from 'rsuite/Input';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Button from 'rsuite/Button';
import Toggle from 'rsuite/Toggle';
import { BrowseInput } from '../UI/kit';

export default class Export extends React.Component {
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
          <Form.Group controlId="project-path">
            <Form.ControlLabel>Directory</Form.ControlLabel>
            <BrowseInput
              style={{width: "100%"}}
              onClick={this.onBrowseClicked}
              value={this.state.directory}
            />
          </Form.Group>
          <Form.Group controlId="size-optimization">
            <Form.ControlLabel>Size Optimization</Form.ControlLabel>
            <Toggle />
          </Form.Group>
          <Form.Group controlId="include-metadata">
            <Form.ControlLabel>Include metadata</Form.ControlLabel>
            <Toggle defaultChecked/>
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary">Export</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    );
  }
}


