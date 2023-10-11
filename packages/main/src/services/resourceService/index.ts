import { readFile, writeFile, mkdir, copyFile, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import project from 'main/project';
import type { ResourceMetadata, ResourceMap } from '@xtory/shared';
import { v4 as uuidv4 } from 'uuid';

class ResourceService {
  #resourcesPath: string;

  #resourcesMapPath: string;

  #resourcesMap: ResourceMap = {};

  constructor(projectPath: string) {
    this.#resourcesPath = join(projectPath, '.xtory', 'resources');
    this.#resourcesMapPath = join(projectPath, '.xtory', 'resources.json');
  }

  async init(): Promise<boolean> {
    try {
      project.logger.info('Initializing ResourceService', ['ResourceService']);

      // Ensure resources directory exists
      await mkdir(this.#resourcesPath, { recursive: true });

      // Load existing resource map if it exists
      try {
        const content = await readFile(this.#resourcesMapPath, 'utf8');
        this.#resourcesMap = JSON.parse(content);
        project.logger.info(
          `Loaded existing resource map with ${
            Object.keys(this.#resourcesMap).length
          } entries`,
          ['ResourceService']
        );
      } catch {
        // File doesn't exist yet, start with empty map
        project.logger.info('No existing resource map, creating new one', [
          'ResourceService',
        ]);
        this.#resourcesMap = {};
        await this.#saveResourceMap();
      }

      return true;
    } catch (error) {
      project.logger.error(`Failed to initialize resource service: ${error}`, [
        'ResourceService',
      ]);
      return false;
    }
  }

  async #saveResourceMap(): Promise<void> {
    await writeFile(
      this.#resourcesMapPath,
      JSON.stringify(this.#resourcesMap, null, 2),
      'utf8'
    );
  }

  async importResource(
    sourcePath: string,
    type: string = 'image'
  ): Promise<string | null> {
    try {
      const uuid = uuidv4();
      const ext = extname(sourcePath);
      const originalName = basename(sourcePath);
      const destFileName = `${uuid}${ext}`;
      const destPath = join(this.#resourcesPath, destFileName);

      project.logger.info(
        `Importing resource: ${originalName} -> ${destFileName}`,
        ['ResourceService']
      );

      // Copy file to resources directory
      await copyFile(sourcePath, destPath);

      // Store metadata
      const relativePath = join('.xtory', 'resources', destFileName);

      this.#resourcesMap[uuid] = {
        path: relativePath,
        type,
        originalName,
        createdAt: new Date().toISOString(),
      };

      await this.#saveResourceMap();

      project.logger.info(`Successfully imported resource with UUID: ${uuid}`, [
        'ResourceService',
      ]);

      return uuid;
    } catch (error) {
      project.logger.error(`Failed to import resource: ${error}`, [
        'ResourceService',
      ]);
      if (error instanceof Error) {
        project.logger.error(`Stack: ${error.stack}`, ['ResourceService']);
      }
      return null;
    }
  }

  getResourcePath(uuid: string): string | null {
    const metadata = this.#resourcesMap[uuid];
    if (!metadata) {
      project.logger.warning(`No metadata found for UUID: ${uuid}`, [
        'ResourceService',
      ]);
    }
    return metadata ? metadata.path : null;
  }

  getResourceMetadata(uuid: string): ResourceMetadata | null {
    return this.#resourcesMap[uuid] || null;
  }

  getAllResources(): ResourceMap {
    return { ...this.#resourcesMap };
  }

  async updateResourceMetadata(
    uuid: string,
    updates: Partial<Pick<ResourceMetadata, 'description' | 'originalName'>>
  ): Promise<boolean> {
    try {
      const metadata = this.#resourcesMap[uuid];
      if (!metadata) {
        return false;
      }

      this.#resourcesMap[uuid] = {
        ...metadata,
        ...updates,
      };

      await this.#saveResourceMap();
      return true;
    } catch (error) {
      project.logger.error(`Failed to update resource metadata: ${error}`, [
        'ResourceService',
      ]);
      return false;
    }
  }

  async removeResource(uuid: string): Promise<boolean> {
    try {
      const metadata = this.#resourcesMap[uuid];
      if (!metadata) {
        return false;
      }

      // Delete the physical file
      const absolutePath = join(this.#resourcesPath, '..', '..', metadata.path);
      try {
        await unlink(absolutePath);
      } catch (error) {
        // File might already be deleted, continue anyway
        project.logger.warning(`Failed to delete resource file: ${error}`, [
          'ResourceService',
        ]);
      }

      // Remove from map
      delete this.#resourcesMap[uuid];
      await this.#saveResourceMap();

      return true;
    } catch (error) {
      project.logger.error(`Failed to remove resource: ${error}`, [
        'ResourceService',
      ]);
      return false;
    }
  }
}

export default ResourceService;
