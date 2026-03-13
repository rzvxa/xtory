import { join } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import type { IService, VariableInfo } from '@xtory/plugin-api';

import project from 'main/project';

class VariablesService implements IService {
  #variablesDir: string;
  #variablesFile: string;

  #table: Record<string, VariableInfo> = {};

  constructor(projectPath: string) {
    this.#variablesDir = join(projectPath, '.xtory');
    this.#variablesFile = join(this.#variablesDir, 'variables.json');
  }

  async init(): Promise<boolean> {
    try {
      project.logger.info('Initializing VariablesService', [
        'VariablesService',
      ]);

      // Ensure .xtory directory exists
      await mkdir(this.#variablesDir, { recursive: true });

      // Load existing variables table or create an empty one
      try {
        const variablesContent = await readFile(this.#variablesFile, 'utf8');
        const loadedVariables = JSON.parse(variablesContent);

        this.#table = loadedVariables;
      } catch {
        // File doesn't exist yet, create default file
        await this.#save();
        project.logger.info('Created default variables file', [
          'VariablesService',
        ]);
      }

      return true;
    } catch (error) {
      project.logger.error(`Failed to initialize variables service: ${error}`, [
        'VariablesService',
      ]);
      return false;
    }
  }

  getVariables(): Record<string, VariableInfo> {
    return { ...this.#table };
  }

  addVariable(variable: VariableInfo): Record<string, VariableInfo> {
    if (variable.name in this.#table) {
      throw new Error(`Variable ${variable.name} already exists`);
    }
    this.#table[variable.name] = variable;
    this.#save();
    return this.getVariables();
  }

  /**
   * @param oldName - if exists allows renaming operation on the variable info given
   */
  updateVariable(
    variable: VariableInfo,
    oldName?: VariableInfo['name']
  ): Record<string, VariableInfo> {
    // rename branch
    if (oldName && oldName !== variable.name) {
      if (!(oldName in this.#table)) {
        throw new Error(
          `Attempt at updating non-existing variable ${
            oldName ?? variable.name
          }`
        );
      }
      if (variable.name in this.#table) {
        throw new Error(
          `Attempt at updating the variable name ${oldName} to an already existing name ${variable.name}`
        );
      }
      // rename variables by removing the old entry and adding a new one
      delete this.#table[oldName];
      this.#table[variable.name] = variable;
    } else {
      if (!(variable.name in this.#table)) {
        throw new Error(
          `Attempt at updating non-existing variable ${
            oldName ?? variable.name
          }`
        );
      }
      this.#table[variable.name] = variable;
      this.#save();
    }
    return this.getVariables();
  }

  removeVariable(name: VariableInfo['name']): Record<string, VariableInfo> {
    if (!(name in this.#table)) {
      throw new Error(`Attempt at removing non-existing variable $name}`);
    }
    delete this.#table[name];
    this.#save();
    return this.getVariables();
  }

  async #save(): Promise<void> {
    await writeFile(
      this.#variablesFile,
      JSON.stringify(this.#table, null, 2),
      'utf8'
    );
  }
}

export default VariablesService;
