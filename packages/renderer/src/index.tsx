import { createRoot } from 'react-dom/client';
import React from 'react';
import * as ReactFlow from 'reactflow';

// Material-UI imports
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import { styled, useTheme } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';

import { VariableType } from '@xtory/plugin-api';
import type { XtoryRenderer } from '@xtory/plugin-api/renderer';

// Shared UI components
import NodeContainer from './components/Nodes/NodeContainer';
import { registerNodeRenderer, getNodeRenderer } from './plugins/NodeRegistry';
import { useResourceDrawer } from './contexts/ResourceDrawerContext';
import logger from './logger';

import App from './App';
import useInit from './hooks/useInit';
import useVariables from './hooks/useVariables';
import useFocusAndCenter from './components/Nodes/useFocusAndCenter';
import TextArea from './components/Nodes/ContextualComponents/TextArea';
import NodeRelativeHandle from './components/Nodes/NodeRelativeHandle';
import PickVariable from './components/PickVariable';
import { uuidv4 } from 'shared/utils';

// Expose renderer api
window.React = React;
// @ts-expect-error we're assigning the readonly variable as part of environment initialization
window.renderer = {
  modules: {
    React,
    ReactFlow,
  },
  ui: {
    icons: Icons,
    // Material-UI components
    Box,
    Checkbox,
    Typography,
    TextField,
    Button,
    IconButton,
    Paper,
    Autocomplete,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    FormLabel,
    InputLabel,
    Tooltip,
    InputAdornment,
    // MUI utilities
    styled,
    useTheme,
    // Shared components
    NodeContainer,
    TextArea,
    PickVariable,
    NodeRelativeHandle,
  },
  hooks: {
    useInit,
    useResourceDrawer,
    useFocusAndCenter,
    useVariables,
  },
  logger,
  getNodeRenderer,
  registerNodeRenderer,
  VariableType,
  uuidv4,
} satisfies XtoryRenderer;

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
