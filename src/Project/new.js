import React from "react";
import { Link } from "react-router-dom";
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';

export default class New extends React.Component {
  render() {
    return (
      <div>
        <Header>
          <h2>New Project</h2>
        </Header>
        <Content>
          <Link to="/Profile">Go back to home</Link>
          <div>
            <img src="https://cdn.britannica.com/13/59613-050-D57A3D88/Vladimir-Ilich-Lenin-1918.jpg?w=400&h=300&c=crop"></img> 
          </div>
        </Content>
      </div>
    );
  }
}


