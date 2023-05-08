import path from 'path';
import { watch, FSWatcher } from 'chokidar';
import { sanitizePath } from 'shared/utils';
import { ChannelsRenderer, ProjectTree, ProjectTreeNode } from 'shared/types';

export type ProjectWatchServiceMessageBroker = (
  channel: ChannelsRenderer,
  ...args: any[]
) => void;

const FlushInterval = 300;

class ProjectWatchService {
  watcher: FSWatcher | null = null;

  messageBroker: ProjectWatchServiceMessageBroker | null = null;

  projectPath: string | null = null;

  projectTree: ProjectTree | null = null;

  worker: ReturnType<typeof setInterval> | null = null;

  isDirty: boolean = false;

  get isWatching(): boolean {
    return !!this.watcher;
  }

  watch(
    projectPath: string,
    messageBroker: ProjectWatchServiceMessageBroker
  ): void {
    this.unwatch();
    this.messageBroker = messageBroker;
    this.projectPath = sanitizePath(projectPath);
    const name = this.projectPath.split('/').pop() || '';
    this.projectTree = {
      name,
      path: this.projectPath,
      isDir: true,
      children: {},
    };
    this.watcher = watch(this.projectPath, {
      ignored: /^\./,
      persistent: true,
    });
    this.watcher
      .on('addDir', (_path) => this.#onAddDir(_path))
      .on('unlinkDir', (_path) => this.#onUnlinkDir(_path))
      .on('add', (_path) => this.#onAdd(_path))
      .on('change', (_path) => this.#onChange(_path))
      .on('unlink', (_path) => this.#onUnlink(_path))
      .on('error', (error) => {
        console.error('Error happened', error);
      });

    this.worker = setInterval(() => this.#worker(), FlushInterval);
  }

  unwatch(): void {
    if (!this.isWatching) return;

    clearInterval(this.worker!);
    this.watcher?.close().catch(console.error);

    this.watcher = null;
    this.messageBroker = null;
    this.projectPath = null;
    this.projectTree = null;
    this.worker = null;
  }

  #worker() {
    if (!this.isDirty) return;

    this.messageBroker!(
      ChannelsRenderer.onProjectTreeUpdated,
      this.projectTree
    );

    this.isDirty = false;
  }

  #findNodeParent(pathArr: string[]): ProjectTreeNode | null {
    let parent = this.projectTree!;

    for (let i = 0; i < pathArr.length; i++) {
      parent = parent.children![pathArr[i]];
      if (!parent) {
        return null;
      }
    }

    return parent;
  }

  #addNode(_path: string, isDir: boolean) {
    const sanitizedPath = sanitizePath(_path);
    const rpath = sanitizePath(path.relative(this.projectPath!, sanitizedPath));

    // Ignore if event fired for the project path
    if (rpath === '') return;

    const pathArr = rpath.split('/');
    const name = pathArr.pop()!;
    const node: ProjectTreeNode = {
      name,
      path: sanitizedPath,
      isDir,
      ...(!isDir && { ext: path.extname(_path) }),
      ...(isDir && { children: {} }),
    };

    const parent = this.#findNodeParent(pathArr);
    if (!parent) {
      console.error(
        'Path part does not exists in the ProjectTree, This Should Never Happen'
      );
      throw Error('Path part does not exists in the ProjectTree,');
    }
    parent.children![name] = node;
    this.isDirty = true;
  }

  #removeNode(_path: string) {
    const sanitizedPath = sanitizePath(_path);
    const rpath = sanitizePath(path.relative(this.projectPath!, sanitizedPath));

    // Ignore if event fired for the project path
    if (rpath === '') return;

    const pathArr = rpath.split('/');
    const name = pathArr.pop()!;

    const parent = this.#findNodeParent(pathArr);

    // parent already deleted
    if (!parent) {
      return;
    }

    delete parent.children![name];
    this.isDirty = true;
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

  #onChange(_path: string) {
    // ignore for now
  }
}

const projectWatchService = new ProjectWatchService();

export default projectWatchService;
