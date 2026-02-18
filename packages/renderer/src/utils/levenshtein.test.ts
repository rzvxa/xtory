import { levenshtein, similarity } from './levenshtein';

describe('levenshtein', () => {
  it('should return 0 for identical strings', () => {
    expect(levenshtein('hello', 'hello')).toBe(0);
    expect(levenshtein('', '')).toBe(0);
  });

  it('should return the length of the string when compared to empty string', () => {
    expect(levenshtein('hello', '')).toBe(5);
    expect(levenshtein('', 'world')).toBe(5);
  });

  it('should calculate distance for single character difference', () => {
    expect(levenshtein('cat', 'bat')).toBe(1); // substitution
    expect(levenshtein('cat', 'cats')).toBe(1); // insertion
    expect(levenshtein('cats', 'cat')).toBe(1); // deletion
  });

  it('should calculate distance for multiple differences', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('saturday', 'sunday')).toBe(3);
  });

  it('should be case-sensitive', () => {
    expect(levenshtein('Hello', 'hello')).toBe(1);
    expect(levenshtein('WORLD', 'world')).toBe(5);
  });

  it('should handle longer strings', () => {
    expect(levenshtein('algorithm', 'altruistic')).toBe(6);
    expect(levenshtein('exponential', 'polynomial')).toBe(6);
  });

  it('should be symmetric', () => {
    expect(levenshtein('abc', 'def')).toBe(levenshtein('def', 'abc'));
    expect(levenshtein('hello', 'world')).toBe(levenshtein('world', 'hello'));
  });
});

describe('similarity', () => {
  it('should return 1 for identical strings', () => {
    expect(similarity('hello', 'hello')).toBe(1);
    expect(similarity('test', 'test')).toBe(1);
  });

  it('should return 1 for two empty strings', () => {
    expect(similarity('', '')).toBe(1);
  });

  it('should return 0 for completely different strings of same length', () => {
    expect(similarity('abc', 'def')).toBe(0);
  });

  it('should return values between 0 and 1', () => {
    const result1 = similarity('kitten', 'sitting');
    const result2 = similarity('saturday', 'sunday');

    expect(result1).toBeGreaterThan(0);
    expect(result1).toBeLessThan(1);
    expect(result2).toBeGreaterThan(0);
    expect(result2).toBeLessThan(1);
  });

  it('should show higher similarity for more similar strings', () => {
    const sim1 = similarity('hello', 'hallo'); // 1 difference
    const sim2 = similarity('hello', 'world'); // 4 differences

    expect(sim1).toBeGreaterThan(sim2);
  });

  it('should be symmetric', () => {
    expect(similarity('abc', 'abd')).toBe(similarity('abd', 'abc'));
    expect(similarity('test', 'text')).toBe(similarity('text', 'test'));
  });

  it('should calculate correctly for strings with different lengths', () => {
    const sim = similarity('cat', 'cats');
    expect(sim).toBe(0.75); // 1 difference in 4 characters
  });
});
