import React from "react";
import Form from 'rsuite/Form';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Button from 'rsuite/Button';

export default class Settings extends React.Component {
  render() {
    return (
      <div className="page-view">
        <Form fluid>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary">Reload Plugins</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    );
  }
}


