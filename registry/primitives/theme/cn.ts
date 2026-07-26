// UIXVISOR — https://uixvisor.dev/primitives/theme
//
// Shared className joiner for registry items. Intentionally tiny: no
// tailwind-merge dependency so copy-and-own stays lean. Pass more specific
// utilities last when you need to override earlier ones.

/** Join truthy class name fragments into a single NativeWind className string. */
export function cn(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}
