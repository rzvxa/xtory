import React from "react";
import { Button, TreePicker } from 'rsuite';
import { NodeEditor, Colors, Controls } from 'flume';
import ConfigBuilder from './essentialNodes';

import './flow.css'

const SubFlow = (data, onChange) => {
  console.log(data);
  return (
    <div className="center-port-control">
      <TreePicker
        defaultExpandAll
        data={[ {
            label: "Conversations",
            value: 1,
            children: [ { label: "ive_said_no.xsub", value: 2 } ]
          }, {
            label: "Quests",
            value: 3,
            children: [ { label: "killing_in_the_name.xsub", value: 4 } ]
          } ]
        }
        defaultValue={parseInt(data)}
        disabledItemValues={[1, 3, 4]}
        style={{ width: 246 }}
      />
    </div>
  );
}

const Config =
ConfigBuilder()
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
        defaultValue: "2", // Empty subflow?
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
  .build();



export default class FlowEditor extends React.Component {
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




