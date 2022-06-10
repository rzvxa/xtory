import React from "react";
import { NodeEditor } from 'flume';
import ConfigBuilder from './flow-config-builder';
import SubFlowConfig from './SubFlows/subflow'
import { StoryNode, StoryView } from './SubFlows/story'
import { Edit } from '@rsuite/icons';
import { ConversationNode, ConversationView } from './SubFlows/conversation'
import { IconButton, ButtonGroup } from 'rsuite';

import './flow.css'

const SaveIcon = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 27 32" fill="currentColor" aria-hidden="true" focusable="false" class="rs-icon" aria-label="save" data-category="legacy"><path d="M6.857 27.429h13.714v-6.857H6.857v6.857zm16 0h2.286v-16c0-.339-.304-1.071-.536-1.304l-5.018-5.018c-.25-.25-.946-.536-1.304-.536V12c0 .946-.768 1.714-1.714 1.714H6.285A1.715 1.715 0 014.571 12V4.571H2.285v22.857h2.286v-7.429c0-.946.768-1.714 1.714-1.714h14.857c.946 0 1.714.768 1.714 1.714v7.429zM16 10.857V5.143a.587.587 0 00-.571-.571H12a.587.587 0 00-.571.571v5.714c0 .304.268.571.571.571h3.429a.587.587 0 00.571-.571zm11.429.572V28c0 .946-.768 1.714-1.714 1.714h-24A1.715 1.715 0 01.001 28V4c0-.946.768-1.714 1.714-1.714h16.571c.946 0 2.25.536 2.929 1.214l5 5c.679.679 1.214 1.982 1.214 2.929z"></path></svg>
  )
}

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
      case 'quest':
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


class FlowEditorPageTitle extends React.Component {
  render() {
    return (
      <>
        {
          this.props.renamable &&
          <IconButton className="edit-name-btn" size="xs" icon={<Edit />} />
        }
        <div className="title-right-box">
          <IconButton color="green" appearance="primary" icon={<SaveIcon/>} onClick={this.props.onSave}>Save</IconButton>
        </div>
      </>
    );
  }
}


class FlowEditor extends React.Component {
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
    this.setState({key:Math.random()});
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
      var state = this.state
      this.props.instance.save(function(ctx){
        ctx.state = state;
      })
    }
  }
  render() {
    return (
      <div className="flow-editor-view">
        <div className="flow-editor-area">
          <NodeEditor
            key={this.state.key}
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



export { FlowEditor, FlowEditorPageTitle}
