import semver from 'semver';

import { detectProject } from '../detect-project.js';
import { loadRegistryIndex } from '../registry-source.js';

export interface DoctorCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

export interface DoctorOptions {
  projectRoot: string;
  registryRoot: string;
}

export async function runDoctor(options: DoctorOptions): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = [];
  const detected = await detectProject(options.projectRoot);

  checks.push({
    name: 'Expo project',
    status: detected.isExpo ? 'pass' : 'fail',
    message: detected.isExpo
      ? `Expo ${detected.expoVersion ?? '(version unknown)'} detected`
      : 'No expo dependency or app.json found',
  });

  checks.push({
    name: 'NativeWind',
    status: detected.nativewindVersion ? 'pass' : 'warn',
    message: detected.nativewindVersion
      ? `NativeWind ${detected.nativewindVersion} detected`
      : 'NativeWind not found in package.json',
  });

  checks.push({
    name: 'Package manager',
    status: detected.packageManager === 'unknown' ? 'warn' : 'pass',
    message:
      detected.packageManager === 'unknown'
        ? 'Could not determine the package manager'
        : detected.packageManager,
  });

  try {
    const index = await loadRegistryIndex(options.registryRoot);
    checks.push({
      name: 'Registry',
      status: 'pass',
      message: `${index.size} item(s) loaded from ${options.registryRoot}`,
    });

    const expoCoerced = detected.expoVersion ? semver.coerce(detected.expoVersion) : null;
    if (expoCoerced) {
      const incompatible = [...index.values()]
        .filter((entry) => {
          const range = entry.item.compatibility.expo;
          return Boolean(range) && !semver.satisfies(expoCoerced, range);
        })
        .map((entry) => entry.item.name);

      checks.push({
        name: 'Expo compatibility',
        status: incompatible.length === 0 ? 'pass' : 'warn',
        message:
          incompatible.length === 0
            ? `All registry items declare compatibility with Expo ${expoCoerced.version}`
            : `${incompatible.length} item(s) may be incompatible with Expo ${expoCoerced.version}: ${incompatible.join(', ')}`,
      });
    }
  } catch (error) {
    checks.push({
      name: 'Registry',
      status: 'fail',
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return checks;
}
