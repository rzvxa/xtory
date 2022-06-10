import React from 'react';
import { Button, TreePicker } from 'rsuite';
import { Colors, Controls } from 'flume';

const SubFlowTreePicker = (props) => {
  const { filter, projectTree, defaultValue, onChange, ...rest } = props;
  if (projectTree === undefined)
    return (<div/>)
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
      return false;
    }
    for (let item of branch) {
      if (item.value === link) {
        return true;
      }
      if (item.children !== undefined) {
        const res = checkLink(item.children, link);
        if (res === true) {
          return true;
        }
      }
    }
    return false;
  }
  const value = () => {
    if (checkLink(projectTree, defaultValue)) {
      if (projectTree[0].value === -1) {
        projectTree.shift();
      }
      return defaultValue;
    }
    if (defaultValue !== null && projectTree[0].value !== -1) {
      projectTree.unshift({
        label: 'Broken Link',
        value: -1,
      });
    }
    return -1;
  }
  const OnChange = (value) => {
    if (value !== 'Broken' && projectTree[0].value === -1) {
      projectTree.shift();
    }
    onChange(value);
  }
  return (
    <TreePicker
      data={projectTree}
      defaultValue={value}
      disabledItemValues={FilterTree(projectTree)}
      onChange={OnChange}
      {...rest}
    />
  );
};

const SubFlow = (data, onChange, context, redraw, portProps) => {
  const onOpenSubFlow = () => {
    context.openSubFlow(data, true);
  }

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
      <Button onClick={onOpenSubFlow} appearance="primary" disabled={(data === -1 || data === null)}>Open</Button>
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
