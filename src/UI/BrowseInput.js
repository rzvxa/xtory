import React from "react";
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import Button from 'rsuite/Button';
import { FolderFill } from '@rsuite/icons'
export default function(props) {
  const { onClick, value, ...rest} = props;
  return (
    <InputGroup onClick={onClick} {...rest}>
      <Input value={value} />
      <InputGroup.Button>
        <FolderFill />
      </InputGroup.Button>
    </InputGroup>
  );
}
