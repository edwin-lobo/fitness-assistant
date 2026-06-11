import { spawn } from 'node:child_process';
import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export const defaultPortableDbConfig = {
  composeFile: 'docker-compose.db.yml',
  composeProject: 'fitness-assistant-db',
  host: '127.0.0.1',
  port: '55432',
  user: 'postgres',
  password: 'postgres',
  database: 'fitness_assistant_test',
  bootstrapDir: 'database/bootstrap',
  migrationsDir: 'supabase/migrations',
  testsDir: 'database/tests',
};

export function getPortableDbConfig(env = process.env) {
  return {
    ...defaultPortableDbConfig,
    port: env.PORTABLE_DB_PORT || defaultPortableDbConfig.port,
  };
}

export function buildComposeArgs(config, args) {
  return ['compose', '-f', config.composeFile, '-p', config.composeProject, ...args];
}

export function buildPsqlArgs(config, file) {
  return [
    '-U',
    config.user,
    '-d',
    config.database,
    '-v',
    'ON_ERROR_STOP=1',
    '-f',
    file,
  ];
}

export function sortSqlFiles(files) {
  return [...files].sort((left, right) => left.localeCompare(right));
}

function commandExists(command) {
  const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
  return result.status === 0;
}

export function resolveContainerCli(env = process.env) {
  if (env.PORTABLE_DB_CONTAINER_CLI) {
    return env.PORTABLE_DB_CONTAINER_CLI;
  }

  return commandExists('docker') ? 'docker' : 'podman';
}

async function findSqlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findSqlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.sql')) {
      files.push(entryPath);
    }
  }

  return sortSqlFiles(files);
}

async function run(command, args, options = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
      env: {
        ...process.env,
        PGPASSWORD: defaultPortableDbConfig.password,
        ...(options.env || {}),
      },
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
      }
    });
  });
}

async function runCompose(config, args) {
  await run(resolveContainerCli(), buildComposeArgs(config, args));
}

async function runPsqlFile(config, file) {
  await runCompose(config, ['exec', '-T', 'postgres', 'psql', ...buildPsqlArgs(config, file)]);
}

async function waitForDatabase(config) {
  const args = ['exec', '-T', 'postgres', 'pg_isready', '-U', config.user, '-d', config.database];

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await runCompose(config, args);
      return;
    } catch {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  }

  throw new Error('Timed out waiting for portable Postgres to become ready.');
}

async function applySqlDirectory(config, directory) {
  const files = await findSqlFiles(directory);
  for (const file of files) {
    await runPsqlFile(config, file);
  }
}

async function start() {
  const config = getPortableDbConfig();
  await runCompose(config, ['up', '-d']);
  await waitForDatabase(config);
}

async function stop() {
  const config = getPortableDbConfig();
  await runCompose(config, ['down']);
}

async function reset() {
  const config = getPortableDbConfig();
  await runCompose(config, ['down', '-v', '--remove-orphans']);
  await start();
}

async function testDatabase() {
  const config = getPortableDbConfig();
  await start();
  await applySqlDirectory(config, config.bootstrapDir);
  await applySqlDirectory(config, config.migrationsDir);
  await applySqlDirectory(config, config.testsDir);
}

const commands = {
  start,
  stop,
  reset,
  test: testDatabase,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  if (!commands[command]) {
    console.error('Usage: node scripts/portable-db.mjs <start|stop|reset|test>');
    process.exitCode = 1;
  } else {
    commands[command]().catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
  }
}
