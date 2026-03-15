import React from 'react';

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { type VariableInfo, VariableType } from '@xtory/plugin-api';
import { useEzSnackbar } from '@xtory/renderer/utils/ezSnackbar';
import { levenshtein } from '@xtory/renderer/utils/levenshtein';
import useVariables from '@xtory/renderer/hooks/useVariables';
import { setVariables } from '@xtory/renderer/state/store/variables';

import { useAppDispatch, useAppSelector } from 'renderer/state/store';

import TextArea from '../Nodes/ContextualComponents/TextArea';
import ToolContainer from './ToolContainer';

/**
 * @param coercion - If this parameter is passed in, it does a simple coercion between numeric and boolean types.
 */
function variableDefaultInitialValue(
  type: VariableType,
  coercion?: { prevType: VariableType; value: unknown }
): unknown {
  if (type === coercion?.prevType) {
    return coercion.value;
  }

  switch (type) {
    case VariableType.Bool:
      if (
        coercion &&
        (coercion.prevType === VariableType.Float ||
          coercion.prevType === VariableType.Int)
      ) {
        return Boolean(coercion.value);
      }
      return false;
    case VariableType.Int:
      if (coercion?.prevType === VariableType.Float) {
        if (Number.isNaN(coercion.value) || !Number.isFinite(coercion.value)) {
          return 0;
        }
        return Math.floor(coercion.value as number);
      }
      if (coercion?.prevType === VariableType.Bool) {
        return coercion.value ? 1 : 0;
      }
      return 0;
    case VariableType.Float:
      if (coercion?.prevType === VariableType.Int) {
        return coercion.value;
      }
      if (coercion?.prevType === VariableType.Bool) {
        return coercion.value ? 1 : 0;
      }
      return 0;
    case VariableType.String:
      return '';
    default:
      throw new Error(`Invalid VariableType: ${type}`);
  }
}

const ExtraSmallIconButton = React.forwardRef<
  HTMLButtonElement | null,
  React.PropsWithChildren<{
    // eslint-disable-next-line react/require-default-props
    onClick?: () => void;
  }>
>(({ children, ...props }, ref) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IconButton sx={{ padding: '4px' }} ref={ref} {...props}>
      {children}
    </IconButton>
  );
});

function VariableTypeField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: VariableType;
  onChange: (type: VariableType) => void;
}) {
  return (
    <Select
      id={id}
      size="small"
      value={value}
      onChange={(e) => {
        onChange(Number(e.target.value) as VariableType);
      }}
    >
      <MenuItem value={VariableType.Bool}>Boolean</MenuItem>
      <MenuItem value={VariableType.Int}>Int</MenuItem>
      <MenuItem value={VariableType.Float}>Float</MenuItem>
      <MenuItem value={VariableType.String}>String</MenuItem>
    </Select>
  );
}

function VariableValueField({
  id,
  value,
  type,
  onChange,
}: {
  id: string;
  value: unknown;
  type: VariableType;
  onChange: (val: boolean | number | string) => void;
}) {
  switch (type) {
    case VariableType.Bool:
      return (
        <Switch
          id={id}
          size="small"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case VariableType.Int:
      return (
        <TextField
          id={id}
          size="small"
          value={String(value)}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            if (Number.isNaN(parsed)) {
              onChange(0);
            } else if (!Number.isFinite(parsed)) {
              // NOTE: I'm writing this without an internet access and can't check
              // the specification to make sure if parsed int is always finite or not
              // might want to remove this check if it is redundant.
              onChange(
                parsed < 0 ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
              );
            } else {
              onChange(parsed);
            }
          }}
        />
      );
    case VariableType.Float:
      return (
        <TextField
          id={id}
          size="small"
          value={String(value)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case VariableType.String:
      return (
        <TextField
          id={id}
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      throw new Error(`Invalid VariableType(${type})`);
  }
}

const VariableCommentButton = React.forwardRef<
  HTMLButtonElement | null,
  React.PropsWithChildren<{
    row: VariableInfo;
    onSave: (comment: string | undefined) => void;
  }>
>(({ row, onSave }, ref) => {
  const [showComment, setShowComment] = React.useState(false);
  const [editComment, setEditComment] = React.useState(false);
  const [comment, setComment] = React.useState(row.comment);

  return (
    <Tooltip
      open={(!!comment && showComment) || editComment}
      onOpen={() => setShowComment(true)}
      onClose={() => setShowComment(false)}
      title={
        <>
          <TextArea
            multiline
            size="small"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxRows={10}
            sx={{ minWidth: '250px' }}
            disabled={!editComment}
          />
          <div
            style={{
              display: editComment ? 'flex' : 'none',
              paddingTop: '4px',
            }}
          >
            <Button size="small" disabled={!comment}>
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              sx={{ ml: 'auto', mr: 0 }}
              onClick={() => {
                onSave(comment);
                setEditComment(false);
              }}
            >
              Save(Ctrl+Enter)
            </Button>
          </div>
        </>
      }
      arrow
    >
      <ExtraSmallIconButton
        ref={ref}
        onClick={() => {
          setEditComment(!editComment);
          if (!editComment) {
            setShowComment(true);
          }
        }}
      >
        {
          // eslint-disable-next-line no-nested-ternary
          editComment ? (
            <Tooltip title="Discard changes" placement="top">
              <CloseIcon fontSize="small" />
            </Tooltip>
          ) : comment ? (
            <Tooltip title="Edit Comment" placement="top">
              <CommentIcon fontSize="small" />
            </Tooltip>
          ) : (
            <Tooltip title="Add Comment" placement="top">
              <AddCommentIcon fontSize="small" />
            </Tooltip>
          )
        }
      </ExtraSmallIconButton>
    </Tooltip>
  );
});

function VariableRow({
  row,
  onSave,
  onRemove,
}: {
  row: VariableInfo;
  onSave: (info: VariableInfo, oldName?: VariableInfo['name']) => void;
  onRemove: (name: VariableInfo['name']) => void;
}) {
  const [isEdit, setIsEdit] = React.useState(false);
  const [draft, setDraft] = React.useState<VariableInfo>({ ...row });
  return (
    <TableRow>
      <TableCell>
        {isEdit ? (
          <TextField
            id="edit-name"
            size="small"
            value={draft.name}
            fullWidth
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        ) : (
          row.name
        )}
      </TableCell>
      <TableCell>
        {isEdit ? (
          <VariableTypeField
            id="edit-type"
            value={draft.type}
            onChange={(type) => setDraft({ ...draft, type })}
          />
        ) : (
          VariableType[row.type]
        )}
      </TableCell>
      <TableCell>
        {isEdit ? (
          <VariableValueField
            id="edit-init"
            value={draft.init}
            type={draft.type}
            onChange={(value) => setDraft({ ...draft, init: value })}
          />
        ) : (
          String(row.init)
        )}
      </TableCell>
      <TableCell align="center">
        {isEdit ? (
          <Tooltip title="Discard Changes" placement="top">
            <ExtraSmallIconButton
              onClick={() => {
                setIsEdit(false);
                setDraft({ ...row });
              }}
            >
              <CloseIcon fontSize="small" />
            </ExtraSmallIconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Edit" placement="top">
            <ExtraSmallIconButton onClick={() => setIsEdit(true)}>
              <EditIcon fontSize="small" />
            </ExtraSmallIconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete" placement="top">
          <ExtraSmallIconButton onClick={() => onRemove(row.name)}>
            <DeleteIcon fontSize="small" />
          </ExtraSmallIconButton>
        </Tooltip>
        <VariableCommentButton
          row={row}
          onSave={(comment) => {
            onSave({ ...row, ...(comment ? { comment } : {}) });
          }}
        />

        {isEdit ? (
          <Tooltip title="Save" placement="top">
            <ExtraSmallIconButton
              onClick={() => {
                setIsEdit(false);
                try {
                  onSave({ ...draft }, row.name);
                } catch {
                  setDraft({ ...row });
                }
              }}
            >
              <SaveIcon fontSize="small" />
            </ExtraSmallIconButton>
          </Tooltip>
        ) : undefined}
      </TableCell>
    </TableRow>
  );
}

function VariablesRows({
  rows,
  onSave,
  onRemove,
}: {
  rows: VariableInfo[];
  onSave: (info: VariableInfo) => void;
  onRemove: (name: VariableInfo['name']) => void;
}) {
  return (
    <>
      {rows.map((row) => (
        <VariableRow
          key={row.name}
          row={row}
          onSave={onSave}
          onRemove={onRemove}
        />
      ))}
    </>
  );
}

function VariablesTable({
  vars,
  onSave,
  onRemove,
}: {
  vars: VariableInfo[];
  onSave: (info: VariableInfo, oldName?: VariableInfo['name']) => void;
  onRemove: (name: VariableInfo['name']) => void;
}) {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Initial Value</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <VariablesRows rows={vars} onSave={onSave} onRemove={onRemove} />
        </TableBody>
      </Table>
      {vars.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Typography>No Variables</Typography>
        </Box>
      ) : undefined}
    </>
  );
}

export default function VariablesTool() {
  const dispatch = useAppDispatch();
  const { toaster } = useEzSnackbar();

  const vars = useVariables();
  const setVars = React.useCallback(
    (vars: Record<string, VariableInfo>) => dispatch(setVariables(vars)),
    [dispatch]
  );

  const [filter, setFilter] = React.useState<string>('');
  const [filtered, setFiltered] = React.useState(Object.values(vars));
  const [addVar, setAddVar] = React.useState(false);
  const [oneMore, setOneMore] = React.useState(false);
  const [inputErrors, setInputErrors] = React.useState<{
    name?: string;
    type?: string;
    init?: string;
    comment?: string;
  }>({});
  const [draft, setDraft] = React.useState<VariableInfo>({
    name: '',
    type: VariableType.Bool,
    init: false,
  });
  const addButtonRef = React.useRef(null);
  const [activeToolName, isToolboxOpen] = useAppSelector((state) => [
    state.toolboxState.activeToolName,
    state.toolboxState.isOpen,
  ]);

  React.useEffect(() => {
    async function getVars() {
      const vars = await window.electron.ipcRenderer.invoke(
        'serviceCall',
        'variables',
        'getVariables'
      );
      setVars(vars);
    }
    getVars();
  }, [setVars]);

  React.useEffect(() => {
    if (filter.length) {
      const scored = Object.values(vars).map((info) => ({
        info,
        score:
          levenshtein(filter, info.name) *
          (info.name.toLowerCase().includes(filter.toLowerCase()) ? -1 : 1),
      }));
      scored.sort((a, b) => a.score - b.score);
      setFiltered(scored.map((it) => it.info));
    } else {
      setFiltered(Object.values(vars));
    }
  }, [vars, filter]);

  React.useEffect(() => {
    if (!isToolboxOpen || activeToolName !== 'Variables') {
      setAddVar(false);
    }
  }, [activeToolName, isToolboxOpen]);

  const onAddVarSubmit = async () => {
    if (draft.name in vars) {
      setInputErrors({
        ...inputErrors,
        name: 'A variable with this name already exists',
      });
      return;
    }
    setInputErrors({});

    try {
      const newVars = await window.electron.ipcRenderer.invoke(
        'serviceCall',
        'variables',
        'addVariable',
        [draft]
      );
      setVars(newVars);
    } catch (e: any) {
      toaster.error(e.message ?? String(e));
    }
    if (!oneMore) {
      setDraft({ name: '', type: VariableType.Bool, init: false });
      setOneMore(false);
      setAddVar(false);
    }
  };

  const onUpdateVar = async (
    info: VariableInfo,
    oldName?: VariableInfo['name']
  ) => {
    try {
      const newVars = await window.electron.ipcRenderer.invoke(
        'serviceCall',
        'variables',
        'updateVariable',
        [info, oldName]
      );
      setVars(newVars);
    } catch (e: any) {
      toaster.error(e.message ?? String(e));
    }
  };

  const onRemoveVar = async (name: VariableInfo['name']) => {
    try {
      const newVars = await window.electron.ipcRenderer.invoke(
        'serviceCall',
        'variables',
        'removeVariable',
        [name]
      );
      setVars(newVars);
    } catch (e: any) {
      toaster.error(e.message ?? String(e));
    }
  };

  const headerControls = (
    <>
      <Popper open={addVar} anchorEl={addButtonRef.current}>
        <Box
          sx={(theme) => ({
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            display: 'flex',
            ml: 'auto',
            mr: 'auto',
            mt: '-1em',
            width: '2em',
            height: '1.42rem',
            boxSizing: 'border-box',
            '&::before': {
              content: '""',
              margin: 'auto',
              display: 'block',
              width: '100%',
              height: '100%',
              backgroundColor: theme.palette.background.paper,
              transform: 'rotate(45deg) translateX(50%) translateY(50%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            },
          })}
        />
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            gap: 2,
            width: '260px',
          }}
        >
          <FormControl fullWidth required>
            <FormLabel
              htmlFor="draft-name"
              aria-describedby="draft-name-error-text"
            >
              Name
            </FormLabel>
            <FormHelperText
              id="draft-name-error-text"
              sx={(theme) => ({ color: theme.palette.error.main })}
            >
              {inputErrors.name}
            </FormHelperText>
            <TextField
              id="draft-name"
              size="small"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth required>
            <FormLabel
              htmlFor="draft-type"
              aria-describedby="draft-type-error-text"
            >
              Type
            </FormLabel>
            <FormHelperText
              id="draft-type-error-text"
              sx={(theme) => ({ color: theme.palette.error.main })}
            >
              {inputErrors.type}
            </FormHelperText>
            <VariableTypeField
              id="draft-type"
              value={draft.type}
              onChange={(type) => {
                setDraft({
                  ...draft,
                  type,
                  init: variableDefaultInitialValue(type, {
                    prevType: draft.type,
                    value: draft.init,
                  }),
                });
              }}
            />
          </FormControl>
          <FormControl fullWidth required>
            <FormLabel
              htmlFor="draft-init"
              aria-describedby="draft-init-error-text"
            >
              Initial Value
            </FormLabel>
            <FormHelperText
              id="draft-init-error-text"
              sx={(theme) => ({ color: theme.palette.error.main })}
            >
              {inputErrors.init}
            </FormHelperText>
            <VariableValueField
              id="draft-init"
              value={draft.init}
              type={draft.type ?? VariableType.Bool}
              onChange={(value) => setDraft({ ...draft, init: value })}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel
              htmlFor="draft-comment"
              aria-describedby="draft-comment-error-text"
            >
              Comment
            </FormLabel>
            <FormHelperText
              id="draft-comment-error-text"
              sx={(theme) => ({ color: theme.palette.error.main })}
            >
              {inputErrors.comment}
            </FormHelperText>
            <TextArea
              id="draft-comment"
              size="small"
              multiline
              minRows={3}
              maxRows={5}
            />
          </FormControl>
          <div
            style={{
              display: 'flex',
              padding: '4px',
            }}
          >
            <FormControlLabel
              label="One More"
              control={
                <Switch
                  size="small"
                  checked={oneMore}
                  onChange={(e) => setOneMore(e.target.checked)}
                />
              }
            />

            <Button
              size="small"
              variant="contained"
              sx={{ ml: 'auto', mr: 0 }}
              onClick={onAddVarSubmit}
            >
              Add
            </Button>
          </div>
        </Paper>
      </Popper>
      <IconButton
        size="small"
        onClick={() => setAddVar(!addVar)}
        ref={addButtonRef}
      >
        {addVar ? (
          <Tooltip title="Close" placement="left" arrow>
            <CloseIcon />
          </Tooltip>
        ) : (
          <Tooltip title="Add" placement="left" arrow>
            <AddIcon />
          </Tooltip>
        )}
      </IconButton>
    </>
  );

  return (
    <ToolContainer title="Variables" headerControls={headerControls}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>
        <VariablesTable
          vars={filtered}
          onSave={onUpdateVar}
          onRemove={onRemoveVar}
        />
      </Box>
    </ToolContainer>
  );
}
