const Node = (conf) => {
  return conf
    .addNodeType({
      type: "substory",
      label: "Sub Story",
      description: "Link to a sub stoy",
      linkTo: ['plot', 'substory'],
      linkFrom: ['plot'],
      inputs: ports => [
        ports.subflow({name: 'story'})
      ]
    });
}

const View = (conf) => {
  return conf
    .addRootNodeType({
      type: "start",
      label: "Start Story",
      initialWidth: 170,
      linkTo: ['plot', 'substory'],
    });
}

export { Node as StoryNode, View as StoryView }

