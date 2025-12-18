import { describe, it, expect } from 'vitest';

// Test utility functions and validation logic

describe('Package Name Validation', () => {
  const isValidPackageName = (name: string): boolean => {
    return /^[a-z][a-z0-9-]*$/.test(name);
  };

  it('accepts valid lowercase package names', () => {
    expect(isValidPackageName('std')).toBe(true);
    expect(isValidPackageName('http-client')).toBe(true);
    expect(isValidPackageName('json2xml')).toBe(true);
    expect(isValidPackageName('a')).toBe(true);
  });

  it('rejects invalid package names', () => {
    expect(isValidPackageName('Std')).toBe(false);
    expect(isValidPackageName('123pkg')).toBe(false);
    expect(isValidPackageName('-invalid')).toBe(false);
    expect(isValidPackageName('has spaces')).toBe(false);
    expect(isValidPackageName('has_underscore')).toBe(false);
    expect(isValidPackageName('')).toBe(false);
  });
});

describe('Version Validation', () => {
  const isValidSemver = (version: string): boolean => {
    return /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version);
  };

  it('accepts valid semver versions', () => {
    expect(isValidSemver('1.0.0')).toBe(true);
    expect(isValidSemver('0.1.0')).toBe(true);
    expect(isValidSemver('12.34.56')).toBe(true);
    expect(isValidSemver('1.0.0-alpha')).toBe(true);
    expect(isValidSemver('1.0.0-beta.1')).toBe(true);
    expect(isValidSemver('2.0.0-rc.1')).toBe(true);
  });

  it('rejects invalid versions', () => {
    expect(isValidSemver('1.0')).toBe(false);
    expect(isValidSemver('v1.0.0')).toBe(false);
    expect(isValidSemver('1.0.0.0')).toBe(false);
    expect(isValidSemver('latest')).toBe(false);
    expect(isValidSemver('')).toBe(false);
  });
});

describe('Token Generation', () => {
  const generateToken = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  it('generates tokens of correct length', () => {
    expect(generateToken(16).length).toBe(16);
    expect(generateToken(32).length).toBe(32);
    expect(generateToken(64).length).toBe(64);
  });

  it('generates unique tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateToken(32));
    }
    // All tokens should be unique
    expect(tokens.size).toBe(100);
  });

  it('generates alphanumeric tokens only', () => {
    const token = generateToken(100);
    expect(/^[A-Za-z0-9]+$/.test(token)).toBe(true);
  });
});

describe('Session ID Generation', () => {
  const generateSessionId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return `sess_${result}`;
  };

  it('generates session IDs with correct prefix', () => {
    const sessionId = generateSessionId();
    expect(sessionId.startsWith('sess_')).toBe(true);
  });

  it('generates session IDs of correct total length', () => {
    const sessionId = generateSessionId();
    expect(sessionId.length).toBe(37); // 'sess_' (5) + 32 chars
  });
});

describe('API Token Generation', () => {
  const generateApiToken = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return `finn_tok_${result}`;
  };

  it('generates API tokens with correct prefix', () => {
    const token = generateApiToken();
    expect(token.startsWith('finn_tok_')).toBe(true);
  });

  it('generates API tokens of correct total length', () => {
    const token = generateApiToken();
    expect(token.length).toBe(41); // 'finn_tok_' (9) + 32 chars
  });
});

describe('Pagination Validation', () => {
  const validatePagination = (limit: string | null, offset: string | null) => {
    const parsedLimit = Math.min(Math.max(parseInt(limit || '50') || 50, 1), 100);
    const parsedOffset = Math.max(parseInt(offset || '0') || 0, 0);
    return { limit: parsedLimit, offset: parsedOffset };
  };

  it('uses default values when not provided', () => {
    const result = validatePagination(null, null);
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(0);
  });

  it('respects provided values', () => {
    const result = validatePagination('20', '10');
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(10);
  });

  it('caps limit at 100', () => {
    const result = validatePagination('200', '0');
    expect(result.limit).toBe(100);
  });

  it('ensures minimum limit of 1', () => {
    const result = validatePagination('-1', '0');
    expect(result.limit).toBe(1);
  });

  it('ensures offset is not negative', () => {
    const result = validatePagination('10', '-5');
    expect(result.offset).toBe(0);
  });

  it('handles invalid input gracefully', () => {
    const result = validatePagination('invalid', 'bad');
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(0);
  });
});

describe('Keywords Parsing', () => {
  const parseKeywords = (keywords: string | null): string[] => {
    if (!keywords) return [];
    try {
      const parsed = JSON.parse(keywords);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  it('parses valid JSON array', () => {
    const result = parseKeywords('["http","client","networking"]');
    expect(result).toEqual(['http', 'client', 'networking']);
  });

  it('returns empty array for null', () => {
    const result = parseKeywords(null);
    expect(result).toEqual([]);
  });

  it('returns empty array for invalid JSON', () => {
    const result = parseKeywords('not valid json');
    expect(result).toEqual([]);
  });

  it('returns empty array for non-array JSON', () => {
    const result = parseKeywords('{"key": "value"}');
    expect(result).toEqual([]);
  });
});

describe('Date Formatting', () => {
  const formatRelativeDate = (timestamp: number): string => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  it('formats recent timestamps as "just now"', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelativeDate(now - 30)).toBe('just now');
  });

  it('formats minutes ago', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelativeDate(now - 120)).toBe('2m ago');
  });

  it('formats hours ago', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelativeDate(now - 7200)).toBe('2h ago');
  });

  it('formats days ago', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelativeDate(now - 172800)).toBe('2d ago');
  });
});
