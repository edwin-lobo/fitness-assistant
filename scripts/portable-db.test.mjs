import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildComposeArgs,
  buildPsqlArgs,
  defaultPortableDbConfig,
  getPortableDbConfig,
  resolveContainerCli,
  sortSqlFiles,
} from './portable-db.mjs';

test('uses the portable Postgres compose file and project name', () => {
  assert.deepEqual(buildComposeArgs(defaultPortableDbConfig, ['up', '-d']), [
    'compose',
    '-f',
    'docker-compose.db.yml',
    '-p',
    'fitness-assistant-db',
    'up',
    '-d',
  ]);
});

test('builds psql args with postgres defaults and ON_ERROR_STOP', () => {
  assert.deepEqual(buildPsqlArgs(defaultPortableDbConfig, 'schema.sql'), [
    '-U',
    'postgres',
    '-d',
    'fitness_assistant_test',
    '-v',
    'ON_ERROR_STOP=1',
    '-f',
    'schema.sql',
  ]);
});

test('allows port override from environment', () => {
  assert.equal(getPortableDbConfig({ PORTABLE_DB_PORT: '55433' }).port, '55433');
});

test('allows container CLI override from environment', () => {
  assert.equal(resolveContainerCli({ PORTABLE_DB_CONTAINER_CLI: 'podman' }), 'podman');
});

test('sorts SQL files by path for deterministic migrations and tests', () => {
  assert.deepEqual(sortSqlFiles(['b.sql', 'a.sql', 'nested/c.sql']), ['a.sql', 'b.sql', 'nested/c.sql']);
});
