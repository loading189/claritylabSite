import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const projectRoot = process.cwd();

const serverOnlyStubUrl = pathToFileURL(path.join(projectRoot, 'lib/test/server-only-stub.mjs')).href;

function resolveAlias(specifier) {
  if (!specifier.startsWith('@/')) return null;

  const relativePath = specifier.slice(2);
  const basePath = path.join(projectRoot, relativePath);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found ? pathToFileURL(found).href : null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') {
    return nextResolve(serverOnlyStubUrl, context);
  }

  const aliased = resolveAlias(specifier);
  if (aliased) {
    return nextResolve(aliased, context);
  }

  return nextResolve(specifier, context);
}
