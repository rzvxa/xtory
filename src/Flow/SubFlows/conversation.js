const Node = (conf) => {
  return conf
    .addNodeType({
      type: "conversation",
      label: "Conversation",
      description: "Link to a conversation subflow",
      linkTo: ['plot', 'conversation', 'substory'],
      linkFrom: ['substory', 'plot'],
      inputs: ports => [
        ports.subflow({name: 'conv'})
      ]
    });
}

const View = (conf) => {
  return conf
    .addRootNodeType({
      type: "start",
      label: "Start Conversation",
      initialWidth: 170,
      linkTo: ['dialogue'],
    })
    .addNodeType({
      type: "dialogue",
      label: "Dialogue",
      description: "a piece of Dialogue",
      initialWidth: 170,
      linkTo: ['plot', 'dialogue', 'end'],
      linkFrom: ['plot'],
      inputs: ports => [
        ports.string()
      ]
    })
    .addNodeType({
      type: "end",
      label: "End Conversation",
      description: "End a Conversation",
      initialWidth: 170,
    });
}

export { Node as ConversationNode, View as ConversationView }
