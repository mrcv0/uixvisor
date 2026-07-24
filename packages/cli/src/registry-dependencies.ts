export interface RegistryNpmDependencyItem {
  name: string;
  dependencies: string[];
}

export interface NpmDependencyRequirement {
  name: string;
  requiredBy: string[];
}

export function collectNpmDependencies(
  items: Iterable<RegistryNpmDependencyItem>,
): NpmDependencyRequirement[] {
  const requirements = new Map<string, Set<string>>();

  for (const item of items) {
    for (const dependency of item.dependencies) {
      const requiredBy = requirements.get(dependency) ?? new Set<string>();
      requiredBy.add(item.name);
      requirements.set(dependency, requiredBy);
    }
  }

  return [...requirements.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, requiredBy]) => ({ name, requiredBy: [...requiredBy].sort() }));
}

export function formatNpmDependencyReport(requirements: NpmDependencyRequirement[]): string[] {
  if (requirements.length === 0) {
    return [];
  }

  return [
    'Required npm dependencies:',
    ...requirements.map(
      (requirement) => `  - ${requirement.name} (required by: ${requirement.requiredBy.join(', ')})`,
    ),
    `Run: npx expo install ${requirements.map((requirement) => requirement.name).join(' ')}`,
  ];
}
