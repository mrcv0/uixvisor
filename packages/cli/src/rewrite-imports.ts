import { basename, dirname, relative, sep } from 'node:path';

const REGISTRY_IMPORT_PATTERN = /@registry\/([a-z0-9-]+)\/([a-z0-9-]+)/g;

export interface RegistryImportItem {
  name: string;
  files: Array<{ source: string; target: string }>;
}

function fileStem(path: string): string {
  return basename(path).replace(/\.[tj]sx?$/, '');
}

export function buildRegistryImportTargets(items: Iterable<RegistryImportItem>): Record<string, string> {
  const targets: Record<string, string> = {};

  for (const item of items) {
    let primaryTarget: string | undefined;
    for (const file of item.files) {
      const aliases = new Set([fileStem(file.source), fileStem(file.target)]);
      for (const alias of aliases) {
        const key = `${item.name}/${alias}`;
        if (targets[key] && targets[key] !== file.target) {
          throw new Error(`Ambiguous registry import target: @registry/${key}`);
        }
        targets[key] = file.target;
      }
      if (aliases.has(item.name)) {
        if (primaryTarget && primaryTarget !== file.target) {
          throw new Error(`Multiple primary files found for registry item "${item.name}"`);
        }
        primaryTarget = file.target;
      }
    }

    const fallbackTarget = item.files[0]?.target;
    if (!primaryTarget && !fallbackTarget) {
      throw new Error(`Registry item "${item.name}" has no files`);
    }
    targets[item.name] = primaryTarget ?? fallbackTarget;
  }

  return targets;
}

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
  return content.replace(REGISTRY_IMPORT_PATTERN, (match, item: string, file: string) => {
    const targetFile =
      dependencyTargets[`${item}/${file}`] ?? (item === file ? dependencyTargets[item] : undefined);
    if (!targetFile) {
      return match;
    }
    return toRelativeImportSpecifier(fromTargetFile, targetFile);
  });
}
