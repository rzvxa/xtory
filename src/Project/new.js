import React from "react";
import Form from 'rsuite/Form';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Button from 'rsuite/Button';
import Input from 'rsuite/Input';
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';


const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
export default class New extends React.Component {
  render() {
    return (
      <div>
        <Header>
          <h2>New Project</h2>
        </Header>
        <Content>
          <Form fluid>
            <Form.Group controlId="project-name">
              <Form.ControlLabel>Project Name</Form.ControlLabel>
              <Form.Control name="name" />
            </Form.Group>
            <Form.Group controlId="project-path">
              <Form.ControlLabel>Directory</Form.ControlLabel>
              <Form.Control name="email" type="email" />
            </Form.Group>
            <Form.Group controlId="project-description">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group>
            <Form.Group controlId="project-description">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group>
            <Form.Group controlId="project-description">
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control rows={5} name="textarea" accepter={Textarea} />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary">Create</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Content>
      </div>
    );
  }
}


