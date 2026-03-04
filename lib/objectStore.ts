import 'server-only';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const root = path.join(process.cwd(), '.vault-storage');

function keyPath(key: string) {
  return path.join(root, key);
}

export async function putObject(key: string, body: Buffer) {
  const filePath = keyPath(key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, body);
}

export async function getObject(key: string) {
  return readFile(keyPath(key));
}
