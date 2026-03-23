import { createRoot } from 'react-dom/client';
import React from 'react';
import * as ReactFlow from 'reactflow';

// Material-UI imports
import Box from '@mui/material/Box';
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
import { styled, useTheme } from '@mui/material/styles';
import * as Icons from '@mui/icons-material';

// Shared UI components
import NodeContainer from './components/Nodes/NodeContainer';
import { registerNodeRenderer, getNodeRenderer } from './plugins/NodeRegistry';
import { useResourceDrawer } from './contexts/ResourceDrawerContext';
import logger from './logger';

import App from './App';
import useInit from './hooks/useInit';
import useFocusAndCenter from './components/Nodes/useFocusAndCenter';
import TextArea from './components/Nodes/ContextualComponents/TextArea';

// Expose renderer api
window.React = React;
window.renderer = {
  modules: {
    React,
    ReactFlow,
  },
  ui: {
    icons: Icons,
    // Material-UI components
    Box,
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
    // MUI utilities
    styled,
    useTheme,
    // Shared components
    NodeContainer,
    TextArea,
  },
  hooks: {
    useInit,
    useResourceDrawer,
    useFocusAndCenter,
  },
  logger,
  getNodeRenderer,
  registerNodeRenderer,
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
