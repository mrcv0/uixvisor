/**
 * The icon vocabulary UIXVISOR components are allowed to reference.
 *
 * Components never import an icon library directly - they render
 * `<Icon name="check" />` and a single adapter file resolves the name to a
 * glyph. Swapping icon libraries therefore means replacing one file rather than
 * editing every component (and every copy a consumer already owns).
 *
 * This list is the contract between components and adapters. Adding a name here
 * without adding it to every adapter is a test failure, not a runtime surprise.
 */
export const semanticIconNames = [
  'check',
  'close',
  'chevron-up',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'search',
  'eye',
  'eye-off',
  'sun',
  'moon',
  'info',
  'warning',
  'error',
  'success',
  'trash',
  'plus',
  'minus',
  'user',
  'settings',
  'refresh',
  'inbox',
  'stack',
  'device',
  'package',
  'window',
  'path',
] as const;

export type SemanticIconName = (typeof semanticIconNames)[number];

/** Any adapter must resolve every semantic name to something renderable. */
export type IconSet<T> = Record<SemanticIconName, T>;

/**
 * Returns the semantic names an adapter failed to provide. Mirrors
 * `validatePreset` for colours so both contracts are checked the same way.
 */
export function validateIconSet(set: Partial<Record<SemanticIconName, unknown>>): SemanticIconName[] {
  return semanticIconNames.filter((name) => !set[name]);
}
