import React from "react";
import Form from 'rsuite/Form';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Button from 'rsuite/Button';
import Toggle from 'rsuite/Toggle';
import { FolderFill } from '@rsuite/icons'

// TODO merge these in a library with other file who use these
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
const onFileBrowseClicked = () => {
  window.electron.showDialog({properties: ['openDirectory']});
};
export default class Export extends React.Component {
  render() {
    return (
      <div>
        <Form fluid>
          <Form.Group controlId="project-path">
            <Form.ControlLabel>Directory</Form.ControlLabel>
            <InputGroup style={{width: "100%"}} onClick={onFileBrowseClicked}>
              <Input />
              <InputGroup.Button>
                <FolderFill />
              </InputGroup.Button>
            </InputGroup>
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


