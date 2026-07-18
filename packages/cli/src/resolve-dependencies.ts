export interface DependencyGraphNode {
  name: string;
  registryDependencies: string[];
}

export function resolveDependencyOrder(
  rootNames: string[],
  getNode: (name: string) => DependencyGraphNode | undefined,
): string[] {
  const order: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(name: string): void {
    if (visited.has(name)) {
      return;
    }
    if (visiting.has(name)) {
      throw new Error(`Circular registryDependencies detected involving "${name}"`);
    }

    const node = getNode(name);
    if (!node) {
      throw new Error(`Unknown registry item "${name}"`);
    }

    visiting.add(name);
    for (const dependency of node.registryDependencies) {
      visit(dependency);
    }
    visiting.delete(name);

    visited.add(name);
    order.push(name);
  }

  for (const name of rootNames) {
    visit(name);
  }

  return order;
}
