import React from "react";
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';

export default class Open extends React.Component {
  render() {
    return (
      <div>
        <Header>
          <h2>Open Project</h2>
        </Header>
        <Content>
          <div>
            <img src="https://cdn.britannica.com/13/59613-050-D57A3D88/Vladimir-Ilich-Lenin-1918.jpg?w=400&h=300&c=crop"></img> 
          </div>
        </Content>
      </div>
    );
  }
}


