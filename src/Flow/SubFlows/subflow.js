import React from 'react';
import { Button, TreePicker } from 'rsuite';
import { Colors, Controls } from 'flume';

const SubFlowTreePicker = (props) => {
  const { filter, projectTree, defaultValue, onChange, ...rest } = props;
  const FilterTree = (branch) => {
    const res = [];
    for (let item of branch) {
      if (item.children !== undefined) {
        res.push(item.value);
        res.push(...FilterTree(item.children))
      } else if (!item.label.endsWith(`.${filter}`)) {
        res.push(item.value);
      }
    }
    return res;
  };
  const FindValueFromLabel = (branch, label) => {
    for (let item of branch) {
      if (item.label === label) {
        return item.value;
      } else if (item.children !== undefined) {
        const res = FindValueFromLabel(item.children, label);
        if (res !== null) {
          return res;
        }
      }
    }
    return null;
  }
  const ValueFromPath = (path) => {
    if (defaultValue === null) {
      return -1;
    } else {
      const res = FindValueFromLabel(projectTree, path);
      if (res === null) {
        return -1;
      } else {
        return res;
      }
    }
  };

  const PathFromValue = (link) => {

  };
  const OnChange = (value) => {
    console.log(value);
  }
  return (
    <TreePicker
      data={projectTree}
      defaultValue={defaultValue}
      disabledItemValues={FilterTree(projectTree)}
      onChange={OnChange}
      {...rest}
    />
  );
};

const SubFlow = (data, onChange, context, redraw, portProps) => {
  return (
    <div className="center-port-control">
      <SubFlowTreePicker
        defaultExpandAll
        filter={portProps.portName}
        projectTree={context.projectTree}
        defaultValue={data}
        style={{ width: 246 }}
        onChange={onChange}
      />
      <br/>
      <Button onClick={() => console.log(data)} appearance="primary">Open</Button>
    </div>
  );
}


export default function (conf) {
  return conf.addPortType({
    type: "subflow",
    name: "subflow",
    label: "SubFlow",
    hidePort: true,
    color: Colors.pink,
    controls: [
      Controls.custom({
        name: "subflow",
        label: "SubFlow",
        defaultValue: null,
        render: SubFlow
      })
    ]
  });
}
