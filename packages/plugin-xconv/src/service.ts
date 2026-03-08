import type { IService, Logger } from '@xtory/plugin-api';
import {
  Conversation,
  ConversationIndex,
  StartConversationNodeData,
} from './types';
import { basename, isAbsolute, join, relative, resolve } from 'path';
import { readdir, readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { Dirent } from 'fs';

export default class ConversationService implements IService {
  #projectPath: string;

  #indexPath: string;

  #index: ConversationIndex[] = [];

  constructor(private readonly logger: Logger, projectPath: string) {
    this.#projectPath = projectPath;
    this.#indexPath = join(projectPath, '.xtory', 'conversation-index.json');
  }

  async init(): Promise<boolean> {
    try {
      this.logger.info('Initializing ConversationService', [
        'ConversationService',
      ]);

      // Load or rebuild index
      try {
        const indexContent = await readFile(this.#indexPath, 'utf8');
        this.#index = JSON.parse(indexContent);
        this.logger.info(
          `Loaded conversation index with ${this.#index.length} entries`,
          ['ConversationService']
        );
      } catch {
        // TODO: This can wipe the malformed but existing index
        // Index doesn't exist, rebuild it
        await this.#rebuildIndex();
        this.logger.info('Built new conversation index', [
          'ConversationService',
        ]);
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to initialize conversation service: ${error}`, [
        'ConversationService',
      ]);
      return false;
    }
  }

  getIndex(): ConversationIndex[] {
    return [...this.#index];
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const indexEntry = this.#index.find((entry) => entry.id === id);
      if (!indexEntry) {
        this.logger.warning(`Conversation not found in index: ${id}`, [
          'ConversationService',
        ]);
        return null;
      }

      const filePath = join(this.#projectPath, indexEntry.filePath);
      const content = await readFile(filePath, 'utf8');
      const conversation: Conversation = JSON.parse(content);

      return conversation;
    } catch (error) {
      this.logger.error(`Failed to load conversation ${id}: ${error}`, [
        'ConversationService',
      ]);
      return null;
    }
  }

  async createConversation(
    path: string,
    name: string,
    description: string,
    characterIds: string[]
  ): Promise<Conversation> {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const fileName = path.endsWith('.xconv') ? path : `${path}.xconv`;

    const conversation: Conversation = {
      id,
      name,
      description,
      characterIds,
      nodes: [
        {
          id: 'start-node',
          type: 'StartConversation',
          position: { x: 100, y: 100 },
          data: {
            name,
            description,
            characterIds,
            conditions: {},
          } as StartConversationNodeData,
        },
        {
          id: 'end-node',
          type: 'EndConversation',
          position: { x: 500, y: 100 },
          data: {},
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await writeFile(
      resolve(this.#projectPath, fileName),
      JSON.stringify(conversation, null, 2),
      'utf8'
    );

    // Update index
    this.#index.push({
      id,
      name,
      description,
      characterIds,
      filePath: fileName,
    });
    await this.#saveIndex();

    this.logger.info(`Created conversation: ${name} (${id})`, [
      'ConversationService',
    ]);

    return conversation;
  }

  async updateConversation(
    id: string,
    updates: Partial<Conversation>
  ): Promise<boolean> {
    try {
      const indexEntry = this.#index.find((entry) => entry.id === id);
      if (!indexEntry) {
        this.logger.warning(`Conversation not found in index: ${id}`, [
          'ConversationService',
        ]);
        return false;
      }

      const filePath = join(this.#projectPath, indexEntry.filePath);
      const content = await readFile(filePath, 'utf8');
      const conversation: Conversation = JSON.parse(content);

      // Merge updates
      const updated: Conversation = {
        ...conversation,
        ...updates,
        id, // Preserve ID
        createdAt: conversation.createdAt, // Preserve creation time
        updatedAt: new Date().toISOString(),
      };

      await writeFile(filePath, JSON.stringify(updated, null, 2), 'utf8');

      // Update index metadata if needed
      const indexEntryIndex = this.#index.findIndex((entry) => entry.id === id);
      if (indexEntryIndex !== -1) {
        this.#index[indexEntryIndex] = {
          id,
          name: updated.name,
          description: updated.description,
          characterIds: updated.characterIds,
          filePath: indexEntry.filePath,
        };
        await this.#saveIndex();
      }

      this.logger.info(`Updated conversation: ${id}`, ['ConversationService']);

      return true;
    } catch (error) {
      this.logger.error(`Failed to update conversation ${id}: ${error}`, [
        'ConversationService',
      ]);
      return false;
    }
  }

  async removeConversation(id: string): Promise<boolean> {
    try {
      const indexEntry = this.#index.find((entry) => entry.id === id);
      if (!indexEntry) {
        this.logger.warning(`Conversation not found in index: ${id}`, [
          'ConversationService',
        ]);
        return false;
      }

      const filePath = join(this.#projectPath, indexEntry.filePath);
      const fs = await import('fs/promises');
      await fs.unlink(filePath);

      // Remove from index
      this.#index = this.#index.filter((entry) => entry.id !== id);
      await this.#saveIndex();

      this.logger.info(`Removed conversation: ${id}`, ['ConversationService']);

      return true;
    } catch (error) {
      this.logger.error(`Failed to remove conversation ${id}: ${error}`, [
        'ConversationService',
      ]);
      return false;
    }
  }

  async #rebuildIndex(): Promise<void> {
    try {
      this.#index = [];

      const xconvFiles = await selectFiles(this.#projectPath, (_, dirent) =>
        dirent.name.endsWith('.xconv')
      ).then((convs) => convs.map((it) => relative(this.#projectPath, it)));

      for (const file of xconvFiles) {
        const filePath = resolve(this.#projectPath, file);
        try {
          const content = await readFile(filePath, 'utf8');
          const conversation: any = JSON.parse(content);

          // Generate missing metadata for template files
          let needsUpdate = false;
          if (!conversation.id || conversation.id === '') {
            conversation.id = uuidv4();
            needsUpdate = true;
          }
          if (!conversation.createdAt || conversation.createdAt === '') {
            conversation.createdAt = new Date().toISOString();
            needsUpdate = true;
          }
          if (!conversation.updatedAt || conversation.updatedAt === '') {
            conversation.updatedAt = conversation.createdAt;
            needsUpdate = true;
          }
          // Extract metadata from start node if missing at root
          if (!conversation.name || conversation.name === '') {
            const startNode = conversation.nodes?.find(
              (n: any) => n.type === 'StartConversation'
            );
            conversation.name =
              startNode?.data?.name || basename(filePath).replace('.xconv', '');
            needsUpdate = true;
          }
          if (!conversation.description) {
            const startNode = conversation.nodes?.find(
              (n: any) => n.type === 'StartConversation'
            );
            conversation.description = startNode?.data?.description || '';
            needsUpdate = true;
          }
          if (!conversation.characterIds) {
            const startNode = conversation.nodes?.find(
              (n: any) => n.type === 'StartConversation'
            );
            conversation.characterIds = startNode?.data?.characterIds || [];
            needsUpdate = true;
          }

          // Save updated file if metadata was added
          if (needsUpdate) {
            await writeFile(
              filePath,
              JSON.stringify(conversation, null, 2),
              'utf8'
            );
            this.logger.info(
              `Updated conversation file with metadata: ${filePath}`,
              ['ConversationService']
            );
          }

          this.#index.push({
            id: conversation.id,
            name: conversation.name,
            description: conversation.description,
            characterIds: conversation.characterIds,
            filePath: file,
          });
        } catch (error) {
          this.logger.warning(
            `Failed to parse conversation file ${filePath}: ${error}`,
            ['ConversationService']
          );
        }
      }

      await this.#saveIndex();
    } catch (error) {
      this.logger.error(`Failed to rebuild conversation index: ${error}`, [
        'ConversationService',
      ]);
    }
  }

  async #saveIndex(): Promise<void> {
    await writeFile(
      this.#indexPath,
      JSON.stringify(this.#index, null, 2),
      'utf8'
    );
  }
}

async function selectFiles(
  root: string,
  filter: (path: string, dirent: Dirent) => boolean
): Promise<string[]> {
  const results: string[] = [];
  const leaves = await readdir(root, { withFileTypes: true });
  for (const leaf of leaves) {
    const fullpath = join(root, leaf.name);
    if (leaf.isDirectory()) {
      const children = await selectFiles(fullpath, filter);
      results.push(...children);
      continue;
    }

    const select = filter(fullpath, leaf);
    if (!select) {
      continue;
    }

    results.push(fullpath);
  }
  return results;
}
