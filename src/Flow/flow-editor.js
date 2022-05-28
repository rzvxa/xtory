import React from "react";
import { NodeEditor } from 'flume';
import ConfigBuilder from './flow-config-builder';
import SubFlowConfig from './SubFlows/subflow'
import { StoryNode, StoryView } from './SubFlows/story'
import { ConversationNode, ConversationView } from './SubFlows/conversation'

import './flow.css'

const MakeConfig = (data) => {
  const GetTypeView = (type) => {
    switch (type) {
      case 'story':
        return StoryView;
      case 'conv':
        return ConversationView;
      case 'quest':
        return ConversationView;
      
      default:
        console.log('type is not implemented');
    }
  };

  const GetTypeNodes = (type) => {
    switch (type) {
      case 'story':
        return (conf) => StoryNode(ConversationNode(conf));
      case 'conv':
        return (conf) => conf;
      
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
    this.state = {};
    this.setNodes = this.setNodes.bind(this);
  }
  onTrigger = (event) => {
    this.props.parentCallback(event.target.myname.value);
    event.preventDefault();
  }
  componentWillMount() {
    this.props.instance.restore(this)
  }
  componentWillUnmount() {
    var state = this.state
    this.props.instance.save(function(ctx){
      ctx.state = state;
    })
  }
  setNodes(nodes) {
    if (this.state.nodes !== nodes) {
      this.setState({nodes: nodes});
    }
  }
  render() {
    return (
      <div className="flow-editor-view">
        <div className="flow-editor-area">
          <NodeEditor
            nodes={this.state.nodes}
            onChange={this.setNodes}
            portTypes={this.config.portTypes}
            nodeTypes={this.config.nodeTypes}
            context={{
              projectTree: this.props.projectTree,
              openSubFlow: this.props.openSubFlow,
            }}
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




