import React from "react";
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Header>
          <h2>Welcome!</h2>
        </Header>
        <Content>
          <div>Welcome to Xtory 0.1.0</div>
        </Content>
      </div>
    );
  }
}


