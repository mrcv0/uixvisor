import { lstat, realpath, stat } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

function isWithinRoot(root: string, path: string): boolean {
  const pathFromRoot = relative(root, path);
  return (
    pathFromRoot === '' ||
    (!isAbsolute(pathFromRoot) &&
      pathFromRoot !== '..' &&
      !pathFromRoot.startsWith(`..${sep}`))
  );
}

export function resolveFileWithinRoot(root: string, filePath: string, field: string): string {
  const resolvedRoot = resolve(root);
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const resolvedPath = resolve(resolvedRoot, normalizedFilePath);
  const hasAbsolutePrefix =
    normalizedFilePath.startsWith('/') || /^[a-zA-Z]:/.test(normalizedFilePath);

  if (!isWithinRoot(resolvedRoot, resolvedPath) || resolvedPath === resolvedRoot || hasAbsolutePrefix) {
    throw new Error(
      `Invalid ${field} path "${filePath}": must be a relative file path within ${resolvedRoot}`,
    );
  }

  return resolvedPath;
}

export async function resolveFileWithinRealRoot(
  root: string,
  filePath: string,
  field: string,
): Promise<string> {
  const resolvedRoot = resolve(root);
  const resolvedPath = resolveFileWithinRoot(resolvedRoot, filePath, field);
  const realRoot = await realpath(resolvedRoot);
  const segments = relative(resolvedRoot, resolvedPath).split(sep);
  let current = resolvedRoot;

  for (const [index, segment] of segments.entries()) {
    current = join(current, segment);
    try {
      await lstat(current);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        break;
      }
      throw error;
    }

    const realCurrent = await realpath(current);
    if (!isWithinRoot(realRoot, realCurrent)) {
      throw new Error(
        `Invalid ${field} path "${filePath}": resolved path escapes the real root ${realRoot}`,
      );
    }

    if (index < segments.length - 1 && !(await stat(current)).isDirectory()) {
      throw new Error(`Invalid ${field} path "${filePath}": parent is not a directory`);
    }
  }

  return resolvedPath;
}
