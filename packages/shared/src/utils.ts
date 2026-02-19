export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* eslint-disable no-bitwise */
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
    /* eslint-enable no-bitwise */
  });
}

export interface TryGetResult<TResult> {
  success: boolean;
  result: TResult | unknown;
}

function ok<TResult>(result: TResult): TryGetResult<TResult> {
  return {
    success: true,
    result,
  };
}

function err<TResult>(result: TResult): TryGetResult<TResult> {
  return {
    success: false,
    result,
  };
}

export function tryGet<TResult>(getter: () => TResult): TryGetResult<TResult> {
  try {
    const result = getter();
    return ok(result);
  } catch (exception) {
    return err(exception);
  }
}

export async function tryGetAsync<TResult>(
  getter: () => Promise<TResult>
): Promise<TryGetResult<TResult>> {
  try {
    const result = await getter();
    return ok(result);
  } catch (exception) {
    return err(exception);
  }
}

export function sanitizePath(path: string, unixSep: boolean = true) {
  let output: string = path;
  if (unixSep) output = output.replaceAll('\\', '/');
  return output;
}

export function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function isMainProcess() {
  return process !== undefined;
}

export function isRendererProcess() {
  return window !== undefined;
}

export interface FileExtensionInfo {
  name: string;
  extension: string;
}

/**
 * Extract file name and extension from a file path.
 * Handles files with multiple dots correctly (e.g., "my.story.xflow" -> name: "my.story", extension: "xflow")
 * @param path - The file path
 * @returns Object containing name (without extension) and extension (lowercase, without dot)
 */
export function extractFileExtension(path: string): FileExtensionInfo {
  // Normalize path separators to forward slashes
  const normalizedPath = path.replaceAll('\\', '/');
  const filename = normalizedPath.split('/').pop() || normalizedPath;
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    // No extension or hidden file
    return { name: filename, extension: '' };
  }

  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex + 1).toLowerCase();

  return { name, extension };
}
