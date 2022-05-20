import React from 'react';
import { Button, TreePicker } from 'rsuite';
import { Colors, Controls } from 'flume';

const SubFlow = (data, onChange) => {
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
        defaultValue: "2", // Empty subflow?
        render: SubFlow
      })
    ]
  });
}
