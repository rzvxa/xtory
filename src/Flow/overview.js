import React from "react";
import Header from 'rsuite/Header';
import Content from 'rsuite/Content';
import { NodeEditor } from 'flume'
import Config from './essentialNodes';

Config
  .addRootNodeType({
    type: "start",
    label: "Start",
    initialWidth: 170,
    outputs: ports => [
      ports.link()
    ]
  });


export default class Overview extends React.Component {
  render() {
    return (
      <div>
        <Header>
          <h2>Overview Flow</h2>
        </Header>
        <Content>
          <div style={{width: '100%', height: '100%'}}>
            <NodeEditor
              portTypes={Config.portTypes}
              nodeTypes={Config.nodeTypes}
              defaultNodes={[
                {
                  type: "start",
                  x: 0,
                  y: 0
                }
              ]}
            />
          </div>
        </Content>
      </div>
    );
  }
}



