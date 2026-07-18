import { dirname, relative, sep } from 'node:path';

const REGISTRY_IMPORT_PATTERN = /@registry\/([a-z0-9-]+)\/\1/g;

export function toRelativeImportSpecifier(fromTargetFile: string, toTargetFile: string): string {
  const fromDir = dirname(fromTargetFile);
  const toWithoutExt = toTargetFile.replace(/\.[tj]sx?$/, '');
  let specifier = relative(fromDir, toWithoutExt).split(sep).join('/');

  if (!specifier.startsWith('.')) {
    specifier = `./${specifier}`;
  }

  return specifier;
}

export function rewriteRegistryImports(
  content: string,
  fromTargetFile: string,
  dependencyTargets: Record<string, string>,
): string {
  return content.replace(REGISTRY_IMPORT_PATTERN, (match, name: string) => {
    const targetFile = dependencyTargets[name];
    if (!targetFile) {
      return match;
    }
    return toRelativeImportSpecifier(fromTargetFile, targetFile);
  });
}
