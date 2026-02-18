import { resolveHtmlPath } from './resolveHtmlPath';

describe('resolveHtmlPath', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalPort = process.env.PORT;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    process.env.PORT = originalPort;
  });

  describe('development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should return localhost URL with default port', () => {
      delete process.env.PORT;
      const result = resolveHtmlPath('index.html');

      expect(result).toBe('http://localhost:1212/index.html');
    });

    it('should use custom port from environment', () => {
      process.env.PORT = '3000';
      const result = resolveHtmlPath('index.html');

      expect(result).toBe('http://localhost:3000/index.html');
    });

    it('should handle nested paths', () => {
      delete process.env.PORT;
      const result = resolveHtmlPath('pages/settings.html');

      expect(result).toBe('http://localhost:1212/pages/settings.html');
    });

    it('should handle paths with special characters', () => {
      delete process.env.PORT;
      const result = resolveHtmlPath('index.html?debug=true');

      // URL class encodes query parameters
      expect(result).toBe('http://localhost:1212/index.html%3Fdebug=true');
    });
  });

  describe('production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should return file protocol URL', () => {
      const result = resolveHtmlPath('index.html');

      expect(result).toContain('file://');
      expect(result).toContain('index.html');
    });

    it('should include renderer directory in path', () => {
      const result = resolveHtmlPath('index.html');

      expect(result).toContain('renderer');
    });

    it('should handle different file names', () => {
      const result = resolveHtmlPath('main.html');

      expect(result).toContain('file://');
      expect(result).toContain('main.html');
    });
  });

  describe('edge cases', () => {
    it('should handle empty filename in development', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.PORT;
      const result = resolveHtmlPath('');

      expect(result).toBe('http://localhost:1212/');
    });

    it('should handle root path in development', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.PORT;
      const result = resolveHtmlPath('/');

      expect(result).toBe('http://localhost:1212/');
    });
  });
});
