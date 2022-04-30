import React from "react";
import { Button } from 'rsuite';
import { NodeEditor, Colors, Controls } from 'flume';
import ConfigBuilder from './essentialNodes';

import './flow.css'

const SubFlow = (data, onChange) => {
  return (
    <div className="center-port-control">
      <Button>Edit Sub Flow</Button>
    </div>
  );
}

ConfigBuilder
  .addRootNodeType({
    type: "start",
    label: "Start",
    initialWidth: 170,
    link: ['plot', 'startConversation', 'conversation'],
  })
  .addPortType({
    type: "subflow",
    name: "subflow",
    label: "SubFlow",
    hidePort: true,
    color: Colors.pink,
    controls: [
      Controls.custom({
        name: "subflow",
        label: "SubFlow",
        defaultValue: "D6TqIa-tWRY", // Empty subflow?
        render: SubFlow
      })
    ]
  })
  .addNodeType({
    type: "conversation",
    label: "Conversation",
    description: "Link to a conversation subflow",
    link: ['plot', 'conversation'],
    inputs: ports => [
      ports.subflow()
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
      </div>
    );
  }
}



