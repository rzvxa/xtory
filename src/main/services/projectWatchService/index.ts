import path from 'path';
import { watch, FSWatcher } from 'chokidar';
import { sanitizePath } from 'shared/utils';
import {
  LogLevel,
  ChannelsRenderer,
  ProjectTree,
  ProjectTreeNode,
} from 'shared/types';

import project from 'main/project';

import IService from '../IService';

export type ProjectWatchServiceMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;

const FlushInterval = 300;

class ProjectWatchService implements IService {
  #messageBroker: ProjectWatchServiceMessageBroker;

  #projectPath: string;

  #projectTree: ProjectTree;

  #watcher: FSWatcher | null = null;

  #workerIdentifier: ReturnType<typeof setInterval> | null = null;

  #isDirty: boolean = false;

  constructor(
    projectPath: string,
    messageBroker: ProjectWatchServiceMessageBroker
  ) {
    this.#messageBroker = messageBroker;
    this.#projectPath = sanitizePath(projectPath);
    const name = this.#projectPath.split('/').pop() || '';
    this.#projectTree = {
      name,
      path: this.#projectPath,
      isDir: true,
      children: undefined,
    };
  }

  async init(): Promise<boolean> {
    this.#watcher = watch(this.#projectPath, {
      ignored: /^\./,
      persistent: true,
    });
    this.#watcher
      .on('addDir', (_path) => this.#onAddDir(_path))
      .on('unlinkDir', (_path) => this.#onUnlinkDir(_path))
      .on('add', (_path) => this.#onAdd(_path))
      .on('change', (_path) => {
        /* ignore for now */
      })
      .on('unlink', (_path) => this.#onUnlink(_path))
      .on('error', (error) => {
        project.logger.log(LogLevel.error, ['ProjectWatchService'], error);
      });

    this.#workerIdentifier = setInterval(() => this.#worker(), FlushInterval);
    return true;
  }

  #worker() {
    if (!this.#isDirty) return;

    this.#messageBroker(
      ChannelsRenderer.onProjectTreeUpdated,
      this.#projectTree
    );

    this.#isDirty = false;
  }

  #findNodeParent(pathArr: string[]): ProjectTreeNode | null {
    let parent = this.#projectTree!;

    for (let i = 0; i < pathArr.length; i++) {
      if (!parent.children) {
        parent.children = {};
      }
      parent = parent.children![pathArr[i]] || {};
    }

    return parent;
  }

  #addNode(_path: string, isDir: boolean) {
    const sanitizedPath = sanitizePath(_path);
    const rpath = sanitizePath(path.relative(this.#projectPath, sanitizedPath));

    // Ignore if event fired for the project path
    if (rpath === '') return;

    const pathArr = rpath.split('/');
    const name = pathArr.pop()!;
    const node: ProjectTreeNode = {
      name,
      path: sanitizedPath,
      isDir,
      ...(!isDir && { ext: path.extname(_path) }),
      ...(isDir && { children: undefined }),
    };

    const parent = this.#findNodeParent(pathArr);
    if (!parent) {
      console.error(
        'Path part does not exists in the ProjectTree, This Should Never Happen'
      );
      throw Error('Path part does not exists in the ProjectTree,');
    }
    if (!parent.children) {
      parent.children = {};
    }
    parent.children![name] = node;
    this.#isDirty = true;
  }

  #removeNode(_path: string) {
    const sanitizedPath = sanitizePath(_path);
    const rpath = sanitizePath(path.relative(this.#projectPath, sanitizedPath));

    // Ignore if event fired for the project path
    if (rpath === '') return;

    const pathArr = rpath.split('/');
    const name = pathArr.pop()!;

    const parent = this.#findNodeParent(pathArr);

    // parent already deleted
    if (!parent || !parent.children) {
      return;
    }

    delete parent.children[name];
    if (!Object.entries(parent.children).length) {
      delete parent.children;
    }
    this.#isDirty = true;
  }

  #onAddDir(_path: string) {
    this.#addNode(_path, true);
  }

  #onAdd(_path: string) {
    this.#addNode(_path, false);
  }

  #onUnlinkDir(_path: string) {
    this.#removeNode(_path);
  }

  #onUnlink(_path: string) {
    this.#removeNode(_path);
  }
}

export default ProjectWatchService;
