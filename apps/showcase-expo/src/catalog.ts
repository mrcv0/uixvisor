/**
 * Single source of truth for the showcase catalogue.
 * When a new registry item lands, add a row here so it appears in the vitrine.
 */

export type CatalogCategory =
  | 'primitives'
  | 'mobile'
  | 'blocks'
  | 'forms'
  | 'screens'
  | 'flows';

export type Presentation = 'inline' | 'fullscreen';

export interface CatalogItem {
  id: string;
  title: string;
  description?: string;
  category: CatalogCategory;
  presentation: Presentation;
}

export type CategoryIcon =
  | 'stack'
  | 'device'
  | 'package'
  | 'window'
  | 'path'
  | 'check';

export interface CategoryMeta {
  id: CatalogCategory;
  title: string;
  description: string;
  icon: CategoryIcon;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'primitives',
    title: 'Primitives',
    description: 'Foundation: theme, type, controls, surfaces.',
    icon: 'stack',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    description: 'Device behaviours: keyboard, gesture, sheets.',
    icon: 'device',
  },
  {
    id: 'blocks',
    title: 'Blocks',
    description: 'Composed pieces used inside screens.',
    icon: 'package',
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Shared Zod schemas and RHF adapter.',
    icon: 'check',
  },
  {
    id: 'screens',
    title: 'Screens',
    description: 'Full-page layouts — live preview.',
    icon: 'window',
  },
  {
    id: 'flows',
    title: 'Flows',
    description: 'Multi-step skeletons with adapters.',
    icon: 'path',
  },
];

export const CATALOG: CatalogItem[] = [
  // Primitives
  {
    id: 'theme',
    title: 'Theme',
    description: 'Semantic tokens, light/dark, elevation.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'text',
    title: 'Text',
    description: 'Type scale, variants, and weights.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'heading',
    title: 'Heading',
    description: 'Levels 1–4 on the shared type ramp.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Variants, sizes, icons, and icon-only.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'icon',
    title: 'Icon',
    description: 'Semantic Phosphor adapter.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'input',
    title: 'Input',
    description: '48px fields with icon slots and errors.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'textarea',
    title: 'Textarea',
    description: 'Multi-line text field.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    description: 'Accessible checked control.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'radio-group',
    title: 'Radio group',
    description: 'Single-select group.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'switch',
    title: 'Switch',
    description: 'Themed native toggle.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'card',
    title: 'Card',
    description: 'Elevated surface with header/content/footer.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'Fallback initials at three sizes.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'badge',
    title: 'Badge',
    description: 'Compact status labels.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'separator',
    title: 'Separator',
    description: 'Horizontal rule.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'spinner',
    title: 'Spinner',
    description: 'Loading indicator.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    description: 'Shimmer placeholder under reduce-motion fallback.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Determinate progress bar.',
    category: 'primitives',
    presentation: 'inline',
  },

  // Mobile — device behaviours
  {
    id: 'otp-input',
    title: 'OTP input',
    description: 'Digit cells for one-time codes.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'search-bar',
    title: 'Search bar',
    description: 'Query field with clear control.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'toast',
    title: 'Toast',
    description: 'Bottom snackbars with status variants.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'empty-state',
    title: 'Empty state',
    description: 'No-results layout with optional action.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'error-state',
    title: 'Error state',
    description: 'Failure layout with retry.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'bottom-sheet',
    title: 'Bottom sheet',
    description: 'Modal surface from the bottom edge.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'swipeable-row',
    title: 'Swipeable row',
    description: 'Swipe left for destructive action.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'keyboard-aware-form',
    title: 'Keyboard-aware form',
    description: 'Scrolls focused fields above the keyboard.',
    category: 'mobile',
    presentation: 'inline',
  },

  // Blocks — compositions
  {
    id: 'app-header',
    title: 'App header',
    description: 'Stack chrome: title, back, trailing.',
    category: 'blocks',
    presentation: 'inline',
  },
  {
    id: 'button-group',
    title: 'Button group',
    description: 'Horizontal wrap of related actions.',
    category: 'blocks',
    presentation: 'inline',
  },
  {
    id: 'form-field',
    title: 'Form field',
    description: 'Label, control slot, hint, and error.',
    category: 'blocks',
    presentation: 'inline',
  },
  {
    id: 'list-item',
    title: 'List item',
    description: 'Row with leading, title, and trailing.',
    category: 'blocks',
    presentation: 'inline',
  },

  // Forms — validation adapter + schemas
  {
    id: 'form-adapter',
    title: 'Form adapter',
    description: 'React Hook Form + Zod bridge for FormField.',
    category: 'forms',
    presentation: 'inline',
  },
  {
    id: 'auth-schemas',
    title: 'Auth schemas',
    description: 'Shared Zod schemas for sign-in, sign-up, OTP.',
    category: 'forms',
    presentation: 'inline',
  },

  // Screens — live full preview
  {
    id: 'sign-in',
    title: 'Sign in',
    description: 'Validated credentials, links, optional social slot.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'sign-up',
    title: 'Sign up',
    description: 'Validated create-account with sign-in link.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'otp-verify',
    title: 'OTP verify',
    description: '6-digit code, destination label, resend.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Greeting, metric cards, empty state.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Avatar, bio, host-owned actions slot.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Controlled toggles + children groups.',
    category: 'screens',
    presentation: 'fullscreen',
  },

  // Flows — multi-step skeletons
  {
    id: 'authenticated-home',
    title: 'Authenticated home',
    description: 'Post-auth hub, destinations, sign-out.',
    category: 'flows',
    presentation: 'fullscreen',
  },
  {
    id: 'email-auth',
    title: 'Email auth',
    description: 'Sign-in / sign-up / OTP multi-step flow.',
    category: 'flows',
    presentation: 'fullscreen',
  },
  {
    id: 'phone-auth',
    title: 'Phone auth',
    description: 'Phone number then OTP verification.',
    category: 'flows',
    presentation: 'fullscreen',
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Linear pager with progress and skip.',
    category: 'flows',
    presentation: 'fullscreen',
  },
];

export function itemsForCategory(category: CatalogCategory): CatalogItem[] {
  return CATALOG.filter((item) => item.category === category);
}

export function getItem(id: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}

export function categoryCount(category: CatalogCategory): number {
  return itemsForCategory(category).length;
}

export function getCategoryMeta(id: CatalogCategory): CategoryMeta {
  const meta = CATEGORIES.find((c) => c.id === id);
  if (!meta) {
    throw new Error(`Unknown category: ${id}`);
  }
  return meta;
}
