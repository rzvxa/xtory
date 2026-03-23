import type { VariableInfo } from '@xtory/plugin-api';

import { useAppSelector } from '../state/store';

export default function useVariables(): Record<string, VariableInfo> {
  return useAppSelector((state) => state.variablesState.vars);
}
