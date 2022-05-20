import React from "react";
import { NodeEditor } from 'flume';
import ConfigBuilder from './flow-config-builder';
import SubFlowConfig from './SubFlows/subflow-config'
import { StoryNode, StoryView } from './SubFlows/story'
import { ConversationNode, ConversationView } from './SubFlows/conversation'

import './flow.css'

const MakeConfig = (data) => {
  const GetTypeView = (type) => {
    switch (type) {
      case 'story':
        return StoryView;
      case 'conversation':
        return ConversationView;
      
      default:
        console.log('type is not implemented');
    }
  };

  const GetTypeNodes = (type) => {
    switch (type) {
      case 'story':
        return (conf) => StoryNode(ConversationNode(conf));
      
      default:
    }
  };
  return (
    ConfigBuilder()
      .applyPartialConfig(SubFlowConfig)
      .applyPartialConfig(GetTypeView(data.type))
      .applyPartialConfig(GetTypeNodes(data.type))
      .build());
}



export default class FlowEditor extends React.Component {
  config = undefined

  constructor(props) {
    super(props);
    this.config = MakeConfig(this.props.data);
    console.log(this.config);
  }
  onTrigger = (event) => {
    this.props.parentCallback(event.target.myname.value);
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <div style={{width: '100%', height: '100%'}}>
          <NodeEditor
            portTypes={this.config.portTypes}
            nodeTypes={this.config.nodeTypes}
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




