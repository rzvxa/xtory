import Project from './project';

class ProjectManager {
  #project: Project | null = null;

  get isOpen(): boolean {
    return this.#project !== null;
  }

  get logger(): LoggingService {
    if (!this.#project) {
      throw Error('No Project Is Open!');
    }
    return this.#project.loggingService;
  }

  setProject(project: Project) {
    if (this.isOpen) {
      this.close();
    }
    this.#project = project;

    this.logger.trace('Project loaded successfully');
  }

  close() {
    this.#project = null;
  }
}

const projectManager = new ProjectManager();

export default projectManager;
