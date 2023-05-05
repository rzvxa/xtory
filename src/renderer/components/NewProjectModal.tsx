import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloseIcon from '@mui/icons-material/Close';

import { NewProjectModel } from 'shared/types';
import FileSystemPathBrowse from './FileSystemPathBrowse';

export interface NewProjectCreateResult {
  created: boolean;
  errorMessage: string;
}

interface NewProjectModalProps {
  open: boolean;
  // result would be null where modal is canceled
  onCancel: () => void;
  onCreate: (input: NewProjectModel) => Promise<NewProjectCreateResult>;
}

type TooltipPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';

interface TextWithTooltipProps {
  title: string;
  value: string;
  tooltip?: boolean;
  color?: string | undefined;
  placement?: TooltipPlacement | undefined;
}

const containerBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '800px',
  height: '600px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

function TextWithTooltip({
  title,
  value,
  tooltip = true,
  color = undefined,
  placement = undefined,
}: TextWithTooltipProps) {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
      open={tooltip}
      TransitionProps={{ timeout: 0 }}
      PopperProps={{
        disablePortal: true,
      }}
      sx={{
        '*': { color: 'red' },
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: 'red',
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ color, whiteSpace: 'nowrap' }}>
        {value}
      </Typography>
    </Tooltip>
  );
}

export function NewProjectModal({
  open,
  onCancel,
  onCreate,
}: NewProjectModalProps) {
  const [projectName, setProjectNameState] = React.useState<string>('');
  const [projectPath, setProjectPathState] = React.useState<string>('');
  const [projectNameError, setProjectNameError] = React.useState<string>('');
  const [projectPathError, setProjectPathError] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const setProjectName = (name: string) => {
    setProjectNameState(name);
    setProjectNameError('');
  };

  const setProjectPath = (path: string) => {
    setProjectPathState(path);
    setProjectPathError('');
  };

  const [addProjectNameToPath, setAddProjectNameToPath] =
    React.useState<boolean>(true);

  const combinedPath = projectPath + (addProjectNameToPath ? projectName : '');

  const onCancelButtonClick = () => {
    onCancel();
  };

  const validateFields = () => {
    /* eslint-disable no-shadow */
    let projectNameError = '';
    let projectPathError = '';
    /* eslint-enable no-shadow */

    if (projectName === '') {
      projectNameError = "Project Name can't be empty";
    }

    if (projectPath === '') {
      projectPathError = "Project Path can't be empty";
    }
    setProjectNameError(projectNameError);
    setProjectPathError(projectPathError);
    return projectNameError === '' && projectPathError === '';
  };

  const onCreateAndOpenClick = async () => {
    const model: NewProjectModel = {
      projectName,
      projectRoot: projectPath,
      projectPath: combinedPath,
      addProjectNameToPath,
    };
    if (!validateFields()) return;

    const result = await onCreate(model);

    if (!result.created) {
      setErrorMessage(result.errorMessage);
    }
  };

  const yourStoryFilesPreviewTooltipPlacement = (): TooltipPlacement => {
    let placement: TooltipPlacement = 'bottom';
    const nameLen = projectName.length;

    if (addProjectNameToPath && nameLen < 28) {
      placement = 'right';
    }

    return placement;
  };

  return (
    <Modal open={open}>
      <Box sx={containerBoxStyle}>
        <Typography id="modal-modal-title" variant="h4">
          {' '}
          Create New Project
        </Typography>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 2,
            height: '100%',
          }}
        >
          <Collapse in={errorMessage !== ''} sx={{ mb: 1 }}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setErrorMessage('');
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {errorMessage}
            </Alert>
          </Collapse>
          <Collapse in={errorMessage === ''}>
            <Alert severity="warning">
              WARNING: Xtory is in early development stage, Use it at your risk.
              Breaking changes may occur till we hit version 1.0 !
            </Alert>
          </Collapse>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& > div': { marginTop: 4 },
            }}
          >
            <TextField
              id="new-project-name"
              label="Project Name"
              placeholder="Enter a Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              error={projectNameError !== ''}
              helperText={projectNameError}
            />
            <FileSystemPathBrowse
              label="Project Path"
              placeholder="Select Project Path"
              value={projectPath}
              onChange={(value) => {
                let path = value;
                if (!value.endsWith('/')) {
                  path += '/';
                }
                setProjectPath(path);
              }}
              error={projectPathError !== ''}
              helperText={projectPathError}
            />
            <FormControlLabel
              label="Add Project Name To The Path"
              control={
                <Checkbox
                  checked={addProjectNameToPath}
                  onChange={(e) => setAddProjectNameToPath(e.target.checked)}
                />
              }
              labelPlacement="end"
            />
            {projectPath && projectName && (
              <Box>
                <Typography variant="subtitle1" mb={6}>
                  What Gets Created:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    width: combinedPath.length > 100 ? 'fit-content' : '100%',
                    justifyContent: 'center',
                  }}
                  pr={4}
                >
                  <TextWithTooltip
                    title={`Path To The ${
                      addProjectNameToPath
                        ? 'Directory Containing Project'
                        : 'Root Of Your Project'
                    }`}
                    value={projectPath}
                    color="#b8bb26"
                    placement="top"
                  />
                  <TextWithTooltip
                    title="Xtory Creates This Directory"
                    value={addProjectNameToPath ? `${projectName}/` : ''}
                    color="#83a598"
                    tooltip={addProjectNameToPath}
                  />
                  <TextWithTooltip
                    title="Your Story Files Goes Here!"
                    value="{Your Story Files}"
                    placement={yourStoryFilesPreviewTooltipPlacement()}
                    color="#fabd2f"
                  />
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex' }} mt="auto">
            <Button variant="outlined" onClick={onCancelButtonClick}>
              Cancel
            </Button>
            <Button
              sx={{ ml: 'auto' }}
              variant="contained"
              onClick={onCreateAndOpenClick}
            >
              Create & Open
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
