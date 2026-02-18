import { uuidv4, tryGet, tryGetAsync, sanitizePath, delay } from './utils';

describe('uuidv4', () => {
  it('should generate a valid UUID v4 format', () => {
    const uuid = uuidv4();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = uuidv4();
    const uuid2 = uuidv4();
    expect(uuid1).not.toBe(uuid2);
  });

  it('should always include the version 4 identifier', () => {
    const uuid = uuidv4();
    expect(uuid.charAt(14)).toBe('4');
  });
});

describe('tryGet', () => {
  it('should return success with result when getter succeeds', () => {
    const getter = () => 42;
    const result = tryGet(getter);

    expect(result.success).toBe(true);
    expect(result.result).toBe(42);
  });

  it('should return failure with exception when getter throws', () => {
    const error = new Error('Test error');
    const getter = () => {
      throw error;
    };
    const result = tryGet(getter);

    expect(result.success).toBe(false);
    expect(result.result).toBe(error);
  });

  it('should handle complex return types', () => {
    const obj = { name: 'test', value: 123 };
    const getter = () => obj;
    const result = tryGet(getter);

    expect(result.success).toBe(true);
    expect(result.result).toEqual(obj);
  });
});

describe('tryGetAsync', () => {
  it('should return success with result when async getter succeeds', async () => {
    const getter = async () => Promise.resolve(42);
    const result = await tryGetAsync(getter);

    expect(result.success).toBe(true);
    expect(result.result).toBe(42);
  });

  it('should return failure with exception when async getter rejects', async () => {
    const error = new Error('Async test error');
    const getter = async () => Promise.reject(error);
    const result = await tryGetAsync(getter);

    expect(result.success).toBe(false);
    expect(result.result).toBe(error);
  });

  it('should handle delayed async operations', async () => {
    const getter = async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      return 'delayed result';
    };
    const result = await tryGetAsync(getter);

    expect(result.success).toBe(true);
    expect(result.result).toBe('delayed result');
  });
});

describe('sanitizePath', () => {
  it('should convert backslashes to forward slashes by default', () => {
    const path = 'C:\\Users\\test\\file.txt';
    const result = sanitizePath(path);
    expect(result).toBe('C:/Users/test/file.txt');
  });

  it('should keep backslashes when unixSep is false', () => {
    const path = 'C:\\Users\\test\\file.txt';
    const result = sanitizePath(path, false);
    expect(result).toBe('C:\\Users\\test\\file.txt');
  });

  it('should handle paths with mixed separators', () => {
    const path = 'C:/Users\\test/file.txt';
    const result = sanitizePath(path);
    expect(result).toBe('C:/Users/test/file.txt');
  });

  it('should handle empty paths', () => {
    const result = sanitizePath('');
    expect(result).toBe('');
  });

  it('should handle paths with only forward slashes', () => {
    const path = '/usr/local/bin';
    const result = sanitizePath(path);
    expect(result).toBe('/usr/local/bin');
  });
});

describe('delay', () => {
  it('should resolve after the specified duration', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    // Allow some margin for timing precision
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });

  it('should resolve immediately for zero duration', async () => {
    const start = Date.now();
    await delay(0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(50);
  });

  it('should be awaitable multiple times', async () => {
    const start = Date.now();
    await delay(50);
    await delay(50);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(90);
  });
});
