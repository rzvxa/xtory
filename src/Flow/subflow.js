import React from "react";
import Header from 'rsuite/Header';
import { Content } from 'rsuite';
import { NodeEditor, Colors, Controls } from 'flume';
import ConfigBuilder from './flow-config-builder';

import './flow.css'

ConfigBuilder
  .addRootNodeType({
    type: "start",
    label: "Start",
    initialWidth: 170,
    link: ['plot', 'startConversation', 'conversation'],
  })
  .addNodeType({
    type: "startConversation",
    label: "Start Conversation",
    description: "Start of a conversation",
    link: ["endConversation"],
  })
  .addNodeType({
    type: "dialogue",
    label: "Dialogue Text",
    description: "Start of a conversation",
    link: ["endConversation"],
    controls: [
      Controls.select({
        name: "saidwhom",
        label: "Said Whom",
        options: [
          {value: "self", label: "Self"},
          {value: "john", label: "John"},
          {value: "marry", label: "Marry"},
          {value: "xyz", label: "XYZ"},
          {value: "abs", label: "ABS"},
        ]
      })
    ]
  })
  .addNodeType({
    type: "endConversation",
    label: "End Conversation",
    description: "End of a conversation",
    inputs: ports => [
      ports.link()
    ],
    outputs: ports => [
      ports.link()
    ]
  })

const Config = ConfigBuilder.build();



export default class Overview extends React.Component {
  onTrigger = (event) => {
    this.props.parentCallback(event.target.myname.value);
    event.preventDefault();
  }
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



