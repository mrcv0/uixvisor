import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

export type PackageManagerName = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';

export interface ProjectDetection {
  isExpo: boolean;
  expoVersion?: string;
  nativewindVersion?: string;
  hasExpoRouter: boolean;
  packageManager: PackageManagerName;
}

interface PackageJson {
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function readPackageJson(projectRoot: string): Promise<PackageJson | undefined> {
  try {
    const raw = await readFile(join(projectRoot, 'package.json'), 'utf-8');
    return JSON.parse(raw) as PackageJson;
  } catch {
    return undefined;
  }
}

function versionFromDeps(pkg: PackageJson | undefined, name: string): string | undefined {
  return pkg?.dependencies?.[name] ?? pkg?.devDependencies?.[name];
}

async function detectPackageManager(
  projectRoot: string,
  pkg: PackageJson | undefined,
): Promise<PackageManagerName> {
  const declared = pkg?.packageManager?.split('@')[0];
  if (declared === 'npm' || declared === 'pnpm' || declared === 'yarn' || declared === 'bun') {
    return declared;
  }

  if (await pathExists(join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await pathExists(join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }
  if (
    (await pathExists(join(projectRoot, 'bun.lock'))) ||
    (await pathExists(join(projectRoot, 'bun.lockb')))
  ) {
    return 'bun';
  }
  if (await pathExists(join(projectRoot, 'package-lock.json'))) {
    return 'npm';
  }

  return 'unknown';
}

export async function detectProject(projectRoot: string): Promise<ProjectDetection> {
  const pkg = await readPackageJson(projectRoot);
  const expoVersion = versionFromDeps(pkg, 'expo');
  const nativewindVersion = versionFromDeps(pkg, 'nativewind');

  const hasExpoRouter =
    Boolean(versionFromDeps(pkg, 'expo-router')) ||
    (await pathExists(join(projectRoot, 'app'))) ||
    (await pathExists(join(projectRoot, 'src', 'app')));

  return {
    isExpo: Boolean(expoVersion) || (await pathExists(join(projectRoot, 'app.json'))),
    expoVersion,
    nativewindVersion,
    hasExpoRouter,
    packageManager: await detectPackageManager(projectRoot, pkg),
  };
}
