import { FlumeConfig, Colors, Controls } from 'flume';

class ConfigBuilder {
  constructor() {
    this.config = {
      nodes: [],
      ports: [],
    }
  }

  addRootNodeType(obj) {
    obj.root = true;
    this.config.nodes.push(obj);
    return this;
  }

  addNodeType(obj) {
    this.config.nodes.push(obj);
    return this;
  }

  addPortType(obj) {
    this.config.ports.push(obj);
    return this;
  }

  applyPartialConfig(patch) {
    return patch(this);
  }

  build() {
    const flumeConfig = new FlumeConfig();
    for (let port of this.config.ports) {
      flumeConfig.addPortType(port);
    }
    const inputs = {};
    for (let node of this.config.nodes)
    {
      const links = node.linkTo;
      if (links !== undefined) {
        // adding output link
        flumeConfig
          .addPortType({
            type: `olink_${node.type}`,
            name: "link",
            label: "Link",
            color: Colors.red,
          });
        const outputs = node.outputs ? node.outputs : p => [];
        node.outputs = ports => {
        const ret = outputs(ports);
        ret.push(ports[`olink_${node.type}`]());
        return ret;
      };
        for (let link of links) {
          if (inputs[link] === undefined) {
            inputs[link] = [];
          }
          inputs[link].push(node.type);
        }
        const linkFrom = node.linkFrom;
        if (linkFrom !== undefined) {
          if (inputs[node.type] === undefined) {
            inputs[node.type] = [];
          }
          for (let link of linkFrom) {
            inputs[node.type].push(link);
          }
        }
      }
    }
    const linked = [];
    for (let ikey in inputs) {
      // console.log( `ikey => ilink_${ikey}`)
      linked.push(ikey);
      const aTypes = [];
      for (let i of inputs[ikey]) {
        const linkType = `olink_${i}`;
        if (!aTypes.includes(linkType))
          aTypes.push(linkType);
      }
      flumeConfig
        .addPortType({
          type: `ilink_${ikey}`,
          name: `ilink_${ikey}`,
          label: 'Link',
          color: Colors.red,
          acceptTypes: aTypes,
        })
    }
    for (let node of this.config.nodes) {
      // console.log( `cnodes => ilink_${node.type}`)
      if (linked.includes(node.type)) {
        const inputs = node.inputs ? node.inputs : p => [];
        node.inputs = ports => {
          const ret = inputs(ports);
          ret.push(ports[`ilink_${node.type}`]());
          return ret;
        };
      }
      if (node.root) {
        flumeConfig.addRootNodeType(node);
      } else {
        flumeConfig.addNodeType(node);
      }
    }
    return flumeConfig;
  }
};

const defaultConfig = () =>
  new ConfigBuilder()
  .addPortType({
    type: "string",
    name: "string",
    label: "Text",
    color: Colors.green,
    controls: [
      Controls.text({
        name: "string",
        label: "Text"
      })
    ]
  })
  .addPortType({
    type: "boolean",
    name: "boolean",
    label: "True/False",
    color: Colors.blue,
    controls: [
      Controls.checkbox({
        name: "boolean",
        label: "True/False"
      })
    ]
  })
  .addPortType({
    type: "number",
    name: "number",
    label: "Number",
    color: Colors.red,
    controls: [
      Controls.number({
        name: "number",
        label: "Number"
      })
    ]
  })
  .addPortType({
    type: "link",
    name: "link",
    label: "Link",
    color: Colors.red,
  })
  .addNodeType({
    type: "string",
    label: "Text",
    description: "Outputs a string of text",
    inputs: ports => [
      ports.string()
    ],
    outputs: ports => [
      ports.string()
    ]
  })
  .addNodeType({
    type: "plot",
    label: "Plot",
    description: "Plot text goes here",
    linkTo: ['plot'],
    inputs: ports => [
      ports.string(),
    ]
  })
  .addNodeType({
    type: "boolean",
    label: "True/False",
    description: "Outputs a true/false value",
    initialWidth: 140,
    inputs: ports => [
      ports.boolean()
    ],
    outputs: ports => [
      ports.boolean()
    ]
  });


export default defaultConfig;
