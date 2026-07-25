// UIXVISOR — https://uixvisor.dev/primitives/icon
//
// This is the ONLY file in the codebase that names an icon library. Components
// render <Icon name="check" /> and never import a glyph themselves, so swapping
// libraries means rewriting this file alone - nothing else, and none of the
// copies a consumer already owns.
//
// The name map below is library data rather than CLI logic, which is why it
// lives here: a new library is a new version of this file, reviewable and
// testable, instead of a CLI release.
import { forwardRef, type ComponentType } from 'react';
import { View } from 'react-native';
import { ArrowClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowClockwise';
import { CaretDownIcon } from 'phosphor-react-native/src/icons/CaretDown';
import { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { CaretUpIcon } from 'phosphor-react-native/src/icons/CaretUp';
import { CheckIcon } from 'phosphor-react-native/src/icons/Check';
import { CheckCircleIcon } from 'phosphor-react-native/src/icons/CheckCircle';
import { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
import { EyeSlashIcon } from 'phosphor-react-native/src/icons/EyeSlash';
import { GearIcon } from 'phosphor-react-native/src/icons/Gear';
import { InfoIcon } from 'phosphor-react-native/src/icons/Info';
import { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { MinusIcon } from 'phosphor-react-native/src/icons/Minus';
import { PlusIcon } from 'phosphor-react-native/src/icons/Plus';
import { TrashIcon } from 'phosphor-react-native/src/icons/Trash';
import { TrayIcon } from 'phosphor-react-native/src/icons/Tray';
import { UserIcon } from 'phosphor-react-native/src/icons/User';
import { WarningIcon } from 'phosphor-react-native/src/icons/Warning';
import { WarningCircleIcon } from 'phosphor-react-native/src/icons/WarningCircle';
import { XIcon } from 'phosphor-react-native/src/icons/X';

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
  | 'inbox';

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

type GlyphComponent = ComponentType<{ size?: number; color?: string; weight?: IconWeight }>;

const glyphs: Record<IconName, GlyphComponent> = {
  check: CheckIcon,
  close: XIcon,
  'chevron-up': CaretUpIcon,
  'chevron-down': CaretDownIcon,
  'chevron-left': CaretLeftIcon,
  'chevron-right': CaretRightIcon,
  search: MagnifyingGlassIcon,
  eye: EyeIcon,
  'eye-off': EyeSlashIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: WarningCircleIcon,
  success: CheckCircleIcon,
  trash: TrashIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  user: UserIcon,
  settings: GearIcon,
  refresh: ArrowClockwiseIcon,
  inbox: TrayIcon,
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
  ({ name, size = 20, color, weight = 'regular', accessibilityLabel }, ref) => {
    const Glyph = glyphs[name];
    const labelled = Boolean(accessibilityLabel);

    return (
      <View
        ref={ref}
        accessible={labelled}
        accessibilityRole={labelled ? 'image' : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityElementsHidden={!labelled}
        importantForAccessibility={labelled ? 'yes' : 'no-hide-descendants'}
      >
        <Glyph size={size} color={color} weight={weight} />
      </View>
    );
  },
);

Icon.displayName = 'Icon';

/** Exported so tests can assert the adapter covers the whole vocabulary. */
export const iconNames = Object.keys(glyphs) as IconName[];
