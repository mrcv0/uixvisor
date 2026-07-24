export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityState?: Record<string, boolean | undefined>;
}

export function accessibilityIssues(props: AccessibilityProps): string[] {
  const issues: string[] = [];
  if (!props.accessibilityRole) {
    issues.push('accessibilityRole is required');
  }
  if (!props.accessibilityLabel) {
    issues.push('accessibilityLabel is required');
  }
  return issues;
}

export function assertAccessible(props: AccessibilityProps): void {
  const issues = accessibilityIssues(props);
  if (issues.length > 0) {
    throw new Error(issues.join('; '));
  }
}
