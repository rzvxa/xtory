import { HTMLAttributes, ReactNode } from 'react';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  FilterOptionsState,
  TextField,
} from '@mui/material';
import {
  VariableType,
  type PickVariableProps,
} from '@xtory/plugin-api/renderer';

import useVariables from '../hooks/useVariables';

function DefaultItemRenderer({
  varName,
  varType,
  ...props
}: HTMLAttributes<HTMLLIElement> & {
  key: any;
  varType: string;
  varName: string;
}) {
  return (
    <li
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <div>
        <div style={{ fontSize: 10, opacity: 0.6 }}>{varType}</div>
        <div>{varName}</div>
      </div>
    </li>
  );
}

export default function PickVariable({
  selected,
  onChange,
  filter,
  renderItem,
  sx,
  style,
}: PickVariableProps) {
  const variables = useVariables();

  function makeFilter(): (
    options: string[],
    state: FilterOptionsState<string>
  ) => string[] {
    if (filter) {
      return (_, state) => {
        return filter(Object.values(variables), state.inputValue).map(
          (info) => info.name
        );
      };
    } else {
      return (options, state) => {
        const inputValue = state.inputValue.toLowerCase();
        if (!inputValue) {
          return options;
        }

        return options.filter(
          (option) =>
            option.toLowerCase().includes(inputValue) ||
            String(variables[option].init).toLowerCase().includes(inputValue) ||
            VariableType[variables[option].type]
              .toLowerCase()
              .includes(inputValue)
        );
      };
    }
  }

  function makeItemRenderer(): (
    props: HTMLAttributes<HTMLLIElement> & { key: any },
    option: string,
    state: AutocompleteRenderOptionState
  ) => ReactNode {
    if (renderItem) {
      return (props, option, state) => {
        return renderItem(props, variables[option], state);
      };
    } else {
      // eslint-disable-next-line react/no-unstable-nested-components, func-names
      return function (props, option) {
        return (
          <DefaultItemRenderer
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            varType={VariableType[variables[option].type]}
            varName={option}
          />
        );
      };
    }
  }

  return (
    <Autocomplete
      sx={sx}
      style={style}
      options={Object.keys(variables)}
      value={selected}
      onChange={
        onChange
          ? (event, value) => onChange(event, value ? variables[value] : null)
          : undefined
      }
      filterOptions={makeFilter()}
      renderOption={makeItemRenderer()}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          placeholder="Select a variable..."
          size="small"
        />
      )}
    />
  );
}
