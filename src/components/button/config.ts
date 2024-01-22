import style from '@/assets/styles/globally/_export.modules.scss'

const RULE_VARIANT_TONAL = ['lg']
const RULE_VARIANT_GHOST = ['xs', 'sm', 'md', 'lg', 'xl']
const RULE_VARIANT_TEXT = ['xs', 'md', 'sm', 'lg']
const RULE_VARIANT_FILLED = ['sm', 'md', 'lg', 'xl']
const RULE_VARIANT_OUTLINE = ['sm', 'md', 'lg', 'xl']
const RULE_FAB_SIZES = ['lg', '2xl', '3xl']
const RULE_FAB_VARIANTS = ['primary', 'success']

export const RULE_FAB = {
  sizes: RULE_FAB_SIZES,
  variants: RULE_FAB_VARIANTS,
}

export const RULE_VARIANTS = {
  primary: RULE_VARIANT_FILLED,
  success: RULE_VARIANT_FILLED,
  danger: RULE_VARIANT_FILLED,
  critical: RULE_VARIANT_FILLED,
  translucent: RULE_VARIANT_FILLED,
  'tonal-primary': RULE_VARIANT_TONAL,
  'tonal-success': RULE_VARIANT_TONAL,
  'tonal-danger': RULE_VARIANT_TONAL,
  'tonal-critical': RULE_VARIANT_TONAL,
  'outline-primary': RULE_VARIANT_OUTLINE,
  'outline-success': RULE_VARIANT_OUTLINE,
  'outline-danger': RULE_VARIANT_OUTLINE,
  'outline-critical': RULE_VARIANT_OUTLINE,
  'ghost-primary': RULE_VARIANT_GHOST,
  'ghost-success': RULE_VARIANT_GHOST,
  'ghost-danger': RULE_VARIANT_GHOST,
  'ghost-critical': RULE_VARIANT_GHOST,
  'text-primary': RULE_VARIANT_TEXT,
  'text-success': RULE_VARIANT_TEXT,
  'text-danger': RULE_VARIANT_TEXT,
  'text-critical': RULE_VARIANT_TEXT,
}

export const SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
  '2xl': 56,
  '3xl': 96,
}

export const ICON_SIZES = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
}

export const ICON_COLORS = {
  fixed: style.colorFixedPrimary,
  white: style.colorSolidWhitePrimary,
  primary: style.colorSolidBrandPrimary,
  danger: style.colorSolidDangerPrimary,
  success: style.colorSolidSuccessPrimary,
  critical: style.colorSolidCriticalPrimary,
}
