import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

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

// Walks up from startDir the same way Node's own module resolution does,
// since in npm/yarn/pnpm workspaces both hoisted node_modules and the
// lockfile itself usually live at the workspace root, not next to the
// package being inspected.
async function findUp(startDir: string, relativePath: string): Promise<string | undefined> {
  let dir = startDir;

  while (true) {
    const candidate = join(dir, relativePath);
    if (await pathExists(candidate)) {
      return candidate;
    }
    const parentDir = dirname(dir);
    if (parentDir === dir) {
      return undefined;
    }
    dir = parentDir;
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

async function readInstalledVersion(projectRoot: string, name: string): Promise<string | undefined> {
  const manifestPath = await findUp(projectRoot, join('node_modules', name, 'package.json'));
  if (!manifestPath) {
    return undefined;
  }

  try {
    const raw = await readFile(manifestPath, 'utf-8');
    return (JSON.parse(raw) as { version?: string }).version;
  } catch {
    return undefined;
  }
}

async function detectPackageManager(
  projectRoot: string,
  pkg: PackageJson | undefined,
): Promise<PackageManagerName> {
  const declared = pkg?.packageManager?.split('@')[0];
  if (declared === 'npm' || declared === 'pnpm' || declared === 'yarn' || declared === 'bun') {
    return declared;
  }

  if (await findUp(projectRoot, 'pnpm-lock.yaml')) {
    return 'pnpm';
  }
  if (await findUp(projectRoot, 'yarn.lock')) {
    return 'yarn';
  }
  if ((await findUp(projectRoot, 'bun.lock')) || (await findUp(projectRoot, 'bun.lockb'))) {
    return 'bun';
  }
  if (await findUp(projectRoot, 'package-lock.json')) {
    return 'npm';
  }

  return 'unknown';
}

export async function detectProject(projectRoot: string): Promise<ProjectDetection> {
  const pkg = await readPackageJson(projectRoot);
  const expoVersion =
    (await readInstalledVersion(projectRoot, 'expo')) ?? versionFromDeps(pkg, 'expo');
  const nativewindVersion =
    (await readInstalledVersion(projectRoot, 'nativewind')) ?? versionFromDeps(pkg, 'nativewind');

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
