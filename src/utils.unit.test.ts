import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNumberWithDecimals } from './utils.ts';

describe('utils', () => {
  test('rounds down with 1 decimal', () => {
    assert.equal(formatNumberWithDecimals(3.84, 1), '3.8');
  });

  test('rounds up with 1 decimal', () => {
    assert.equal(formatNumberWithDecimals(3.85, 1), '3.9');
  });

  test('rounds up with 2 decimals', () => {
    assert.equal(formatNumberWithDecimals(3.847, 2), '3.85');
  });

  test('preserves one decimal on whole number', () => {
    assert.equal(formatNumberWithDecimals(5, 1), '5.0');
  });

  test('skips decimals with 0 decimals specified', () => {
    assert.equal(formatNumberWithDecimals(5.0, 0), '5');
  });
});
