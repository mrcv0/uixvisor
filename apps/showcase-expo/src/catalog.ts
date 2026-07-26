/**
 * Single source of truth for the showcase catalogue.
 * When a new registry item lands, add a row here so it appears in the vitrine.
 */

export type CatalogCategory = 'primitives' | 'mobile' | 'blocks' | 'screens' | 'flows';

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
  | 'path';

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
    description: 'Foundational controls and surfaces.',
    icon: 'stack',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    description: 'Behaviours that only make sense on a device.',
    icon: 'device',
  },
  {
    id: 'blocks',
    title: 'Blocks',
    description: 'Composed pieces for real screens.',
    icon: 'package',
  },
  {
    id: 'screens',
    title: 'Screens',
    description: 'Full-page layouts ready to own.',
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
    description: 'Semantic colours, elevation, press feedback.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'text',
    title: 'Text',
    description: 'Body type with variants and weights.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'heading',
    title: 'Heading',
    description: 'Display type levels 1–4.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Six variants across three sizes.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'icon-button',
    title: 'Icon button',
    description: '48px target on every variant.',
    category: 'primitives',
    presentation: 'inline',
  },
  {
    id: 'icon',
    title: 'Icon',
    description: 'Semantic icon adapter (Phosphor).',
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

  // Mobile
  {
    id: 'otp-input',
    title: 'OTP input',
    description: 'Six-digit code entry.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'search-bar',
    title: 'Search bar',
    description: 'Query field with clear affordance.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'toast',
    title: 'Toast',
    description: 'Transient feedback messages.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'empty-state',
    title: 'Empty state',
    description: 'No-results composition.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'error-state',
    title: 'Error state',
    description: 'Retryable failure composition.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'bottom-sheet',
    title: 'Bottom sheet',
    description: 'Modal sheet over content.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'swipeable-row',
    title: 'Swipeable row',
    description: 'Swipe left to reveal delete.',
    category: 'mobile',
    presentation: 'inline',
  },
  {
    id: 'keyboard-aware-form',
    title: 'Keyboard-aware form',
    description: 'Full-screen form that tracks the keyboard.',
    category: 'mobile',
    presentation: 'inline',
  },

  // Blocks
  {
    id: 'app-header',
    title: 'App header',
    description: 'Top bar with optional back and trailing slots.',
    category: 'blocks',
    presentation: 'inline',
  },
  {
    id: 'button-group',
    title: 'Button group',
    description: 'Horizontal wrap of actions.',
    category: 'blocks',
    presentation: 'inline',
  },
  {
    id: 'form-field',
    title: 'Form field',
    description: 'Label, control, hint, and error.',
    category: 'blocks',
    presentation: 'inline',
  },
  {
    id: 'list-item',
    title: 'List item',
    description: 'Pressable row with leading and trailing slots.',
    category: 'blocks',
    presentation: 'inline',
  },

  // Screens — full viewport
  {
    id: 'sign-in',
    title: 'Sign in',
    description: 'Email and password credentials.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'sign-up',
    title: 'Sign up',
    description: 'Create account form.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'otp-verify',
    title: 'OTP verify',
    description: 'Six-digit verification screen.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Greeting plus highlight cards.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Avatar, name, bio, and actions.',
    category: 'screens',
    presentation: 'fullscreen',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Notification and biometric toggles.',
    category: 'screens',
    presentation: 'fullscreen',
  },

  // Flows
  {
    id: 'authenticated-home',
    title: 'Authenticated home',
    description: 'Post-auth hub with navigation targets.',
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
