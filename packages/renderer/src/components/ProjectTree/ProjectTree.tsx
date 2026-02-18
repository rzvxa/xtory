import React from 'react';

import { SimpleTreeView as MuiTreeView } from '@mui/x-tree-view';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import FolderEmptyIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import ConvIcon from '@mui/icons-material/Forum';

import {
  Platform,
  ChannelsMain,
  ProjectTree as ProjectTreeState,
  ProjectTreeNode,
  uuidv4,
} from '@xtory/shared';

import { ContextMenuItem } from 'renderer/components/ContextMenu';
import { useAppSelector, useAppDispatch } from 'renderer/state/store';
import {
  ProjectTreeNodeState,
  ProjectTreeNodeStates,
} from 'renderer/state/types';
import {
  setIsProjectTreeFocus,
  setProjectTreeNodeState,
  setSelectedNode,
} from 'renderer/state/store/filesTool';

import TreeItem from './TreeItem';

interface TreeNodeProps {
  treeData: ProjectTreeState | ProjectTreeNode;
}

function TreeNode({ treeData }: TreeNodeProps) {
  const dispatch = useAppDispatch();
  const { name, path, isDir, children } = treeData;
  const nodeId = path;

  const treeNodeState: ProjectTreeNodeState | undefined = useAppSelector(
    (state) => state.filesToolState.projectTreeNodeStates[nodeId] || {}
  );
  const isProjectTreeFocus: boolean = useAppSelector(
    (state) => state.filesToolState.isProjectTreeFocus
  );
  const projectPath: string = useAppSelector(
    (state) => state.projectState.projectPath
  )!;
  const fileMenuItems = useAppSelector(
    (state) => state.filesToolState.fileMenuItems
  );

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (!isProjectTreeFocus) return;
      if (!treeNodeState.isSelected) return;
      if (event.key === 'F2') {
        dispatch(setProjectTreeNodeState({ nodeId, isRename: true }));
      }
    },
    [nodeId, isProjectTreeFocus, treeNodeState.isSelected, dispatch]
  );

  const onOpen = () => {
    window.electron.ipcRenderer.sendMessage(ChannelsMain.openFileAsTab, path);
  };

  const onExpandToggle = () => {
    dispatch(
      setProjectTreeNodeState({ nodeId, isExpanded: !treeNodeState.isExpanded })
    );
  };

  const onNewFolder = async () => {
    const rootPath = isDir ? path : path.split('/').slice(0, -1).join('/');
    const basePath = `${rootPath}/New Folder`;
    let newPath;
    let newCount = 0;
    while (newCount >= 0) {
      /* eslint-disable no-await-in-loop */
      newPath = basePath + (newCount === 0 ? '' : ` ${newCount}`);
      if (
        !(await window.electron.ipcRenderer.invoke(
          ChannelsMain.fspExists,
          newPath
        ))
      ) {
        await window.electron.ipcRenderer.invoke(
          ChannelsMain.fspMkdir,
          newPath
        );
        newCount = -1;
        break;
      }
      newCount++;
      /* eslint-enable no-await-in-loop */
    }
    dispatch(setSelectedNode(newPath));
    dispatch(setProjectTreeNodeState({ nodeId, isExpanded: true }));
    dispatch(setProjectTreeNodeState({ nodeId: newPath, isRename: true }));
  };

  const onNewFile = async (
    extension: string,
    defaultName: string,
    templatePath?: string
  ) => {
    const rootPath = isDir ? path : path.split('/').slice(0, -1).join('/');
    const basePath = `${rootPath}/${defaultName}`;
    let newPath;
    let newCount = 0;

    // Get template content if templatePath is provided
    let templateContent = 'data123';
    if (templatePath) {
      try {
        const pluginPath = `plugin://${templatePath}`;
        const response = await fetch(pluginPath);
        if (response.ok) {
          templateContent = await response.text();
        }
      } catch {
        // Fallback to default content if template fetch fails
      }
    }

    while (newCount >= 0) {
      /* eslint-disable no-await-in-loop */
      newPath = `${basePath}${
        newCount === 0 ? '' : ` ${newCount}`
      }.${extension}`;
      if (
        !(await window.electron.ipcRenderer.invoke(
          ChannelsMain.fspExists,
          newPath
        ))
      ) {
        await window.electron.ipcRenderer.invoke(
          ChannelsMain.fspWriteFile,
          newPath,
          templateContent
        );
        newCount = -1;
        break;
      }
      newCount++;
      /* eslint-enable no-await-in-loop */
    }
    dispatch(setSelectedNode(newPath));
    dispatch(setProjectTreeNodeState({ nodeId, isExpanded: true }));
    dispatch(setProjectTreeNodeState({ nodeId: newPath, isRename: true }));
  };

  const onReveal = () => {
    window.electron.ipcRenderer.sendMessage(ChannelsMain.revealPathInOS, path);
  };

  const onDelete = () => {
    window.electron.ipcRenderer.sendMessage(ChannelsMain.fsRemove, path);
  };

  const onRename = () => {
    // setting a timeout to let this render call ends!
    setTimeout(() =>
      dispatch(setProjectTreeNodeState({ nodeId, isRename: true }))
    );
  };

  const onCopyPath = () => {
    navigator.clipboard.writeText(path);
  };

  const onCopyRelativePath = () => {
    navigator.clipboard.writeText(path.replace(`${projectPath}/`, ''));
  };

  const onRenameDone = (newName: string) => {
    dispatch(setProjectTreeNodeState({ nodeId, isRename: false }));
    if (name === newName) return;
    const newPath = path.split('/').slice(0, -1).join('/').concat('/', newName);
    window.electron.ipcRenderer.sendMessage(ChannelsMain.fsMove, path, newPath);
  };

  const onCollapse = () => {
    dispatch(setProjectTreeNodeState({ nodeId, isExpanded: false }));
  };

  const onExpand = () => {
    dispatch(setProjectTreeNodeState({ nodeId, isExpanded: true }));
  };

  const icon = () => {
    if (!isDir) {
      // file icon
      return <ConvIcon />;
    }
    if (children) {
      return <FolderIcon />;
    }
    return <FolderEmptyIcon />;
  };

  const revealPathInOS = [
    [Platform.win32, 'Reveal in File Explorer'],
    [Platform.darwin, 'Reveal in Finder'],
    [Platform.linux, 'Open Containing Folder'],
  ].reduce((accumulator, current, index, array) => {
    const [flag, value] = current;
    if (index === array.length - 1 && accumulator === '') return value;
    if (window.platform === flag) return value;
    return accumulator;
  }, '');

  const dirContextItems = [
    <ContextMenuItem
      key={uuidv4()}
      label={treeNodeState.isExpanded ? 'Collapse' : 'Expand'}
      shortcut="Enter"
      onClick={onExpandToggle}
    />,
  ];

  const fileContextItems = [
    <ContextMenuItem
      key={uuidv4()}
      label="Open"
      shortcut="Enter"
      onClick={onOpen}
    />,
  ];

  const createContextMenuItems = [
    <ContextMenuItem
      key={uuidv4()}
      label="New Folder"
      onClick={() => {
        onNewFolder();
      }}
    />,
    <ContextMenuItem
      key={uuidv4()}
      label="New Sub Story"
      onClick={() => {
        onNewFile('xflow', 'New Sub Story');
      }}
    />,
    ...fileMenuItems.map((menuItem) => {
      const extension = menuItem.templatePath.split('.').pop() || '';
      return (
        <ContextMenuItem
          key={uuidv4()}
          label={menuItem.title}
          onClick={() => {
            onNewFile(extension, menuItem.title, menuItem.templatePath);
          }}
        />
      );
    }),
  ];

  const contextMenuItems = [
    ...(isDir ? dirContextItems : fileContextItems),
    <Divider key={uuidv4()} variant="middle" />,
    ...createContextMenuItems,
    <Divider key={uuidv4()} variant="middle" />,
    <ContextMenuItem
      key={uuidv4()}
      label={revealPathInOS}
      onClick={onReveal}
    />,
    <Divider key={uuidv4()} variant="middle" />,
    <ContextMenuItem
      key={uuidv4()}
      label="Copy Path"
      shortcut="Shift + Alt + C"
      onClick={onCopyPath}
    />,
    <ContextMenuItem
      key={uuidv4()}
      label="Copy Relative Path"
      onClick={onCopyRelativePath}
    />,
    <Divider key={uuidv4()} variant="middle" />,
    <ContextMenuItem
      key={uuidv4()}
      label="Rename..."
      shortcut="F2"
      onClick={onRename}
    />,
    <ContextMenuItem
      key={uuidv4()}
      label="Delete"
      shortcut="Delete"
      onClick={onDelete}
    />,
  ];

  React.useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <TreeItem
      itemId={nodeId}
      label={name}
      icon={icon()}
      isDir={isDir}
      isRename={treeNodeState.isRename}
      onRenameDone={onRenameDone}
      onDoubleClick={() => {
        if (!isDir) onOpen();
      }}
      onCollapse={onCollapse}
      onExpand={onExpand}
      contextMenuItems={contextMenuItems}
    >
      {children &&
        Object.entries(children)
          .sort((a, b) => {
            const [aPath, aObject] = a;
            const [bPath, bObject] = b;
            if (!(aObject.isDir && bObject.isDir)) {
              if (aObject.isDir) return -1;
              return 1;
            }
            return aPath.localeCompare(bPath);
          })
          .map(([_, node]) => <TreeNode key={node.path} treeData={node} />)}
    </TreeItem>
  );
}

export default function ProjectTree() {
  const dispatch = useAppDispatch();
  const projectTree: ProjectTreeState = useAppSelector(
    (state) => state.projectState.projectTree
  );
  const projectTreeStates: ProjectTreeNodeStates = useAppSelector(
    (state) => state.filesToolState.projectTreeNodeStates
  );

  React.useEffect(() => {
    if (projectTree?.path) {
      dispatch(
        setProjectTreeNodeState({
          nodeId: projectTree.path,
          isExpanded: true,
        })
      );
    }
  }, [dispatch, projectTree?.path]);

  const onFocus = () => {
    dispatch(setIsProjectTreeFocus(true));
  };

  const onBlur = () => {
    dispatch(setIsProjectTreeFocus(false));
  };

  const selected = Object.entries(projectTreeStates)
    .filter((kv: [string, ProjectTreeNodeState]) => kv[1].isSelected)
    .map((kv: [string, ProjectTreeNodeState]) => kv[0]);

  const onNodeSelect = (
    _event: React.SyntheticEvent,
    itemId: string | null
  ) => {
    if (itemId) {
      dispatch(setSelectedNode(itemId));
    }
  };

  const expanded = Object.entries(projectTreeStates)
    .filter((kv: [string, ProjectTreeNodeState]) => kv[1].isExpanded)
    .map((kv: [string, ProjectTreeNodeState]) => kv[0]);
  const onNodeToggle = (
    _event: React.SyntheticEvent | null,
    itemIds: string[]
  ) => {
    const newIds = itemIds.filter((id) => !expanded.includes(id));
    const removedIds = expanded.filter((id) => !itemIds.includes(id));
    newIds.map((id) =>
      dispatch(setProjectTreeNodeState({ nodeId: id, isExpanded: true }))
    );
    removedIds.map((id) =>
      dispatch(setProjectTreeNodeState({ nodeId: id, isExpanded: false }))
    );
  };

  return (
    <MuiTreeView
      slots={{
        collapseIcon: ExpandMoreIcon,
        expandIcon: ChevronRightIcon,
      }}
      onSelectedItemsChange={(e: any, itemId: any) =>
        onNodeSelect(e, itemId as string)
      }
      selectedItems={selected[0] || null}
      onExpandedItemsChange={onNodeToggle}
      expandedItems={expanded}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label="Project Tool"
      sx={{ flexGrow: 1, overflowY: 'auto' }}
    >
      {projectTree && <TreeNode treeData={projectTree} />}
    </MuiTreeView>
  );
}
