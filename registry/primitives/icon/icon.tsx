// UIXVISOR — https://uixvisor.dev/primitives/icon
//
// This is the ONLY file in the codebase that names an icon library. Components
// render <Icon name="check" /> and never import a glyph themselves, so swapping
// libraries means rewriting this file alone - nothing else, and none of the
// copies a consumer already owns.
//
// Opt out of NativeWind's JSX transform. css-interop wraps every element and
// reads `baseComponent.displayName`; when a glyph import is missing or when SVG
// icons are run through that path, you get
// "Cannot read property 'displayName' of undefined". Phosphor renders via
// react-native-svg and must stay on the plain React JSX runtime.
/** @jsxImportSource react */
import { forwardRef, type ComponentType } from 'react';
import { View } from 'react-native';

// Deep imports keep the Metro graph per-icon (barrel import pulls the whole set).
// Import the module namespace first, then pick the named export — some Metro
// resolutions on Windows return a module object where a direct named import
// can be undefined even though the export exists.
import * as AppWindowMod from 'phosphor-react-native/src/icons/AppWindow';
import * as ArrowClockwiseMod from 'phosphor-react-native/src/icons/ArrowClockwise';
import * as CaretDownMod from 'phosphor-react-native/src/icons/CaretDown';
import * as CaretLeftMod from 'phosphor-react-native/src/icons/CaretLeft';
import * as CaretRightMod from 'phosphor-react-native/src/icons/CaretRight';
import * as CaretUpMod from 'phosphor-react-native/src/icons/CaretUp';
import * as CheckMod from 'phosphor-react-native/src/icons/Check';
import * as CheckCircleMod from 'phosphor-react-native/src/icons/CheckCircle';
import * as DeviceMobileMod from 'phosphor-react-native/src/icons/DeviceMobile';
import * as EyeMod from 'phosphor-react-native/src/icons/Eye';
import * as EyeSlashMod from 'phosphor-react-native/src/icons/EyeSlash';
import * as GearMod from 'phosphor-react-native/src/icons/Gear';
import * as InfoMod from 'phosphor-react-native/src/icons/Info';
import * as MagnifyingGlassMod from 'phosphor-react-native/src/icons/MagnifyingGlass';
import * as MinusMod from 'phosphor-react-native/src/icons/Minus';
import * as MoonMod from 'phosphor-react-native/src/icons/Moon';
import * as PackageMod from 'phosphor-react-native/src/icons/Package';
import * as PlusMod from 'phosphor-react-native/src/icons/Plus';
import * as StackMod from 'phosphor-react-native/src/icons/Stack';
import * as SunMod from 'phosphor-react-native/src/icons/Sun';
import * as TrashMod from 'phosphor-react-native/src/icons/Trash';
import * as TrayMod from 'phosphor-react-native/src/icons/Tray';
import * as TreeStructureMod from 'phosphor-react-native/src/icons/TreeStructure';
import * as UserMod from 'phosphor-react-native/src/icons/User';
import * as WarningMod from 'phosphor-react-native/src/icons/Warning';
import * as WarningCircleMod from 'phosphor-react-native/src/icons/WarningCircle';
import * as XMod from 'phosphor-react-native/src/icons/X';

/**
 * The semantic vocabulary components may use. Mirrors `semanticIconNames` in
 * @uixvisor/tokens; a registry test asserts the two never drift apart.
 */
export type IconName =
  | 'check'
  | 'close'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'search'
  | 'eye'
  | 'eye-off'
  | 'sun'
  | 'moon'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'trash'
  | 'plus'
  | 'minus'
  | 'user'
  | 'settings'
  | 'refresh'
  | 'inbox'
  | 'stack'
  | 'device'
  | 'package'
  | 'window'
  | 'path';

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

type GlyphComponent = ComponentType<{ size?: number; color?: string; weight?: IconWeight }>;

/**
 * Resolve a Phosphor icon from a namespace import. Prefers the modern `*Icon`
 * export, then the legacy un-suffixed name.
 */
function pickGlyph(
  mod: Record<string, unknown>,
  iconExport: string,
  legacyExport?: string,
): GlyphComponent {
  const modern = mod[iconExport];
  if (typeof modern === 'function') {
    return modern as GlyphComponent;
  }
  if (legacyExport) {
    const legacy = mod[legacyExport];
    if (typeof legacy === 'function') {
      return legacy as GlyphComponent;
    }
  }
  // Last resort: first function export on the module (handles unusual interop shapes).
  for (const value of Object.values(mod)) {
    if (typeof value === 'function') {
      return value as GlyphComponent;
    }
  }
  throw new Error(
    `UIXVISOR Icon: could not resolve phosphor export "${iconExport}". Got keys: ${Object.keys(mod).join(', ') || '(none)'}`,
  );
}

const glyphs: Record<IconName, GlyphComponent> = {
  check: pickGlyph(CheckMod, 'CheckIcon', 'Check'),
  close: pickGlyph(XMod, 'XIcon', 'X'),
  'chevron-up': pickGlyph(CaretUpMod, 'CaretUpIcon', 'CaretUp'),
  'chevron-down': pickGlyph(CaretDownMod, 'CaretDownIcon', 'CaretDown'),
  'chevron-left': pickGlyph(CaretLeftMod, 'CaretLeftIcon', 'CaretLeft'),
  'chevron-right': pickGlyph(CaretRightMod, 'CaretRightIcon', 'CaretRight'),
  search: pickGlyph(MagnifyingGlassMod, 'MagnifyingGlassIcon', 'MagnifyingGlass'),
  eye: pickGlyph(EyeMod, 'EyeIcon', 'Eye'),
  'eye-off': pickGlyph(EyeSlashMod, 'EyeSlashIcon', 'EyeSlash'),
  sun: pickGlyph(SunMod, 'SunIcon', 'Sun'),
  moon: pickGlyph(MoonMod, 'MoonIcon', 'Moon'),
  info: pickGlyph(InfoMod, 'InfoIcon', 'Info'),
  warning: pickGlyph(WarningMod, 'WarningIcon', 'Warning'),
  error: pickGlyph(WarningCircleMod, 'WarningCircleIcon', 'WarningCircle'),
  success: pickGlyph(CheckCircleMod, 'CheckCircleIcon', 'CheckCircle'),
  trash: pickGlyph(TrashMod, 'TrashIcon', 'Trash'),
  plus: pickGlyph(PlusMod, 'PlusIcon', 'Plus'),
  minus: pickGlyph(MinusMod, 'MinusIcon', 'Minus'),
  user: pickGlyph(UserMod, 'UserIcon', 'User'),
  settings: pickGlyph(GearMod, 'GearIcon', 'Gear'),
  refresh: pickGlyph(ArrowClockwiseMod, 'ArrowClockwiseIcon', 'ArrowClockwise'),
  inbox: pickGlyph(TrayMod, 'TrayIcon', 'Tray'),
  stack: pickGlyph(StackMod, 'StackIcon', 'Stack'),
  device: pickGlyph(DeviceMobileMod, 'DeviceMobileIcon', 'DeviceMobile'),
  package: pickGlyph(PackageMod, 'PackageIcon', 'Package'),
  window: pickGlyph(AppWindowMod, 'AppWindowIcon', 'AppWindow'),
  // Prefer TreeStructure over Path: Path's SVG defs share the name `Path` with
  // react-native-svg's Path, which has caused flaky Metro interop.
  path: pickGlyph(TreeStructureMod, 'TreeStructureIcon', 'TreeStructure'),
};

export interface IconProps {
  name: IconName;
  /** Defaults to 20, which sits comfortably against the 16px base type step. */
  size?: number;
  /**
   * Icons render as SVG and cannot inherit a NativeWind text colour, so callers
   * pass a resolved value - usually from `useThemeColor`.
   */
  color?: string;
  weight?: IconWeight;
  /**
   * Icons are decorative by default and hidden from screen readers. Pass a label
   * only when the icon is the sole carrier of meaning.
   */
  accessibilityLabel?: string;
}

export const Icon = forwardRef<View, IconProps>(
  ({ name, size = 20, color = '#000000', weight = 'regular', accessibilityLabel }, ref) => {
    const Glyph = glyphs[name];
    const labelled = Boolean(accessibilityLabel);

    if (!Glyph) {
      if (__DEV__) {
        console.error(`UIXVISOR Icon: unknown icon name "${name}"`);
      }
      return <View ref={ref} style={{ width: size, height: size }} />;
    }

    return (
      <View
        ref={ref}
        accessible={labelled}
        accessibilityRole={labelled ? 'image' : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityElementsHidden={!labelled}
        importantForAccessibility={labelled ? 'yes' : 'no-hide-descendants'}
        // Explicit size so the glyph's layout box is stable without NativeWind.
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      >
        <Glyph size={size} color={color} weight={weight} />
      </View>
    );
  },
);

Icon.displayName = 'Icon';

/** Exported so tests can assert the adapter covers the whole vocabulary. */
export const iconNames = Object.keys(glyphs) as IconName[];
