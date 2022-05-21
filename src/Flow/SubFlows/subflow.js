import React from 'react';
import { Button, TreePicker } from 'rsuite';
import { Colors, Controls } from 'flume';

const SubFlowTreePicker = (props) => {
  const { filter, projectTree, defaultValue, ...rest } = props;
  const FilterTree = (branch) => {
    const res = [];
    if (branch === undefined) {
      return undefined;
    }
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
  const checkLink = (branch, link) => {
    if (branch === undefined || branch === null) {
    console.log('falll');
      return false;
    }
    for (let item of branch) {
      if (item.value === link) {
    console.log('trueee');
        return true;
      }
      if (item.children !== undefined) {
        const res = checkLink(item.children, link);
        if (res === true) {
    console.log('ccture');
          return true;
        }
      }
    }
    console.log('end');
    return false;
  }
  const value = () => {
    if (checkLink(defaultValue)) {
      return defaultValue;
    }
    projectTree.push({
      label: 'Broken Link',
      value: -1,
    });
    return -1;
  }
  return (
    <TreePicker
      data={projectTree}
      defaultValue={value}
      disabledItemValues={FilterTree(projectTree)}
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
      <Button onClick={() => {onChange(data); console.log(data);}} appearance="primary">Open</Button>
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
