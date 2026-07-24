import { isAbsolute, relative, resolve, sep } from 'node:path';

export function resolveFileWithinRoot(root: string, filePath: string, field: string): string {
  const resolvedRoot = resolve(root);
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const resolvedPath = resolve(resolvedRoot, normalizedFilePath);
  const pathFromRoot = relative(resolvedRoot, resolvedPath);
  const hasAbsolutePrefix =
    normalizedFilePath.startsWith('/') || /^[a-zA-Z]:/.test(normalizedFilePath);
  const escapesRoot =
    pathFromRoot === '..' || pathFromRoot.startsWith(`..${sep}`) || isAbsolute(pathFromRoot);

  if (pathFromRoot === '' || hasAbsolutePrefix || escapesRoot) {
    throw new Error(
      `Invalid ${field} path "${filePath}": must be a relative file path within ${resolvedRoot}`,
    );
  }

  return resolvedPath;
}
