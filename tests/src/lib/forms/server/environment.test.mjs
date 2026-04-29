import test from 'node:test';
import assert from 'node:assert/strict';
import { createTsModuleLoader } from '../../../../helpers/ts-module-loader.mjs';

test('normalizeEnvironmentValue strips surrounding quotes and blank values', () => {
  const previousTarget = process.env.VERCEL_TARGET_ENV;
  process.env.VERCEL_TARGET_ENV = 'preview';
  try {
    const { importModule } = createTsModuleLoader();
    const { normalizeEnvironmentValue, shouldTreatSlackAsRequired } = importModule('src/lib/forms/server/environment.ts');

    assert.equal(normalizeEnvironmentValue('"C083Y0300M7"'), 'C083Y0300M7');
    assert.equal(normalizeEnvironmentValue('""https://example.com""'), 'https://example.com');
    assert.equal(normalizeEnvironmentValue('   '), undefined);
    assert.equal(shouldTreatSlackAsRequired(), false);
  } finally {
    process.env.VERCEL_TARGET_ENV = previousTarget;
  }
});

test('shouldTreatSlackAsRequired is true in production', () => {
  const previousTarget = process.env.VERCEL_TARGET_ENV;
  process.env.VERCEL_TARGET_ENV = 'production';
  try {
    const { importModule } = createTsModuleLoader();
    const { shouldTreatSlackAsRequired } = importModule('src/lib/forms/server/environment.ts');
    assert.equal(shouldTreatSlackAsRequired(), true);
  } finally {
    process.env.VERCEL_TARGET_ENV = previousTarget;
  }
});
