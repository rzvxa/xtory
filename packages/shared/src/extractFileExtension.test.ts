import { extractFileExtension } from './utils';

describe('extractFileExtension', () => {
  describe('basic file names', () => {
    it('should extract extension from simple file name', () => {
      expect(extractFileExtension('file.txt')).toEqual({
        name: 'file',
        extension: 'txt',
      });
    });

    it('should extract extension from path with directory', () => {
      expect(extractFileExtension('path/to/file.txt')).toEqual({
        name: 'file',
        extension: 'txt',
      });
    });

    it('should extract extension from Windows path', () => {
      expect(extractFileExtension('C:\\Users\\project\\file.txt')).toEqual({
        name: 'file',
        extension: 'txt',
      });
    });
  });

  describe('files with multiple dots', () => {
    it('should extract last extension from file with multiple dots', () => {
      expect(extractFileExtension('my.story.xflow')).toEqual({
        name: 'my.story',
        extension: 'xflow',
      });
    });

    it('should extract last extension from path with multiple dots', () => {
      expect(extractFileExtension('path/to/chapter.1.xflow')).toEqual({
        name: 'chapter.1',
        extension: 'xflow',
      });
    });

    it('should handle backup files correctly', () => {
      expect(extractFileExtension('document.backup.txt')).toEqual({
        name: 'document.backup',
        extension: 'txt',
      });
    });

    it('should handle version numbers in filenames', () => {
      expect(extractFileExtension('v2.1.5.config.json')).toEqual({
        name: 'v2.1.5.config',
        extension: 'json',
      });
    });
  });

  describe('case normalization', () => {
    it('should normalize extension to lowercase', () => {
      expect(extractFileExtension('file.XFLOW')).toEqual({
        name: 'file',
        extension: 'xflow',
      });
    });

    it('should normalize mixed case extension', () => {
      expect(extractFileExtension('document.TxT')).toEqual({
        name: 'document',
        extension: 'txt',
      });
    });

    it('should preserve case in filename but not extension', () => {
      expect(extractFileExtension('MyFile.TXT')).toEqual({
        name: 'MyFile',
        extension: 'txt',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle file with no extension', () => {
      expect(extractFileExtension('README')).toEqual({
        name: 'README',
        extension: '',
      });
    });

    it('should handle hidden file with no extension', () => {
      expect(extractFileExtension('.gitignore')).toEqual({
        name: '.gitignore',
        extension: '',
      });
    });

    it('should handle hidden file with extension', () => {
      expect(extractFileExtension('.config.json')).toEqual({
        name: '.config',
        extension: 'json',
      });
    });

    it('should handle file ending with dot', () => {
      expect(extractFileExtension('file.')).toEqual({
        name: 'file',
        extension: '',
      });
    });

    it('should handle path with trailing slash', () => {
      // When path ends with slash, pop() returns empty string and falls back to full path
      // This is an edge case that shouldn't occur in normal file opening
      expect(extractFileExtension('path/to/dir/')).toEqual({
        name: 'path/to/dir/',
        extension: '',
      });
    });

    it('should handle just a filename', () => {
      expect(extractFileExtension('file')).toEqual({
        name: 'file',
        extension: '',
      });
    });
  });

  describe('path separators', () => {
    it('should handle Unix paths', () => {
      expect(extractFileExtension('/home/user/document.pdf')).toEqual({
        name: 'document',
        extension: 'pdf',
      });
    });

    it('should handle Windows paths', () => {
      expect(extractFileExtension('C:\\Users\\Documents\\file.docx')).toEqual({
        name: 'file',
        extension: 'docx',
      });
    });

    it('should handle mixed path separators', () => {
      expect(extractFileExtension('C:/Users/Documents\\file.txt')).toEqual({
        name: 'file',
        extension: 'txt',
      });
    });
  });
});
