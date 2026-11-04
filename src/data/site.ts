export interface SiteLink {
  label: string
  href: string
}

export type BrandPresetKey = 'primary' | 'secondary'

export interface BrandPalette {
  background: string
  card?: string
  foreground: string
  muted: string
  mutedForeground?: string
  border: string
  accent: string
  accentForeground: string
  accent2?: string
  accent2Foreground?: string
  input?: string
  sidebar?: string
  ring: string
  sidebarActiveBg: string
  sidebarActiveText: string
}

export interface BrandConfig {
  light: BrandPalette
  dark: BrandPalette
}

export interface OgImageConfig {
  /** Background gradient start color (hex). Defaults to dark background from brand. */
  backgroundStart?: string
  /** Background gradient end color (hex). Defaults to dark muted from brand. */
  backgroundEnd?: string
  /** Accent color for top bar and decorative orbs (hex). Defaults to dark accent from brand. */
  accent?: string
  /** Title text color (hex). Defaults to dark foreground from brand. */
  titleColor?: string
  /** Description text color (hex). */
  descriptionColor?: string
  /** Group label text color (hex). Defaults to accent. */
  groupColor?: string
  /** Domain text shown in the bottom bar (e.g. "docs.example.com"). Defaults to THALLY_SITE_URL hostname. */
  domain?: string
  /** Logo text displayed in the bottom bar. Defaults to site name. */
  logoText?: string
  /** Google Font family for the title. Defaults to "Inter". */
  fontFamily?: string
  /** Google Font weight for the title. Defaults to "700". */
  fontWeight?: string
}

export interface AnalyticsConfig {
  /** Google Analytics measurement ID (e.g. "G-XXXXXXXXXX"). */
  googleAnalyticsId?: string
  /** Plausible domain (e.g. "docs.example.com"). */
  plausibleDomain?: string
  /** Plausible script URL. Defaults to "https://plausible.io/js/script.js". */
  plausibleScriptUrl?: string
  /** PostHog project API key. */
  posthogKey?: string
  /** PostHog API host. Defaults to "https://us.i.posthog.com". */
  posthogHost?: string
}

export interface DocVersion {
  /** Version label displayed in the switcher (e.g. "v2.0", "Latest"). */
  label: string
  /** URL for this version. Use "/" for the current site, or a full URL for older versions hosted elsewhere. */
  href: string
  /** Whether this is the currently active version. Exactly one should be true. */
  current?: boolean
}

export interface SiteConfig {
  name: string
  description: string
  repoUrl: string
  links: Array<SiteLink>
  brand: BrandConfig
  brandPreset: BrandPresetKey
  brandPresets: Record<BrandPresetKey, BrandConfig>
  /** Configuration for dynamic OG image generation. All fields are optional and fall back to brand colors. */
  ogImage?: OgImageConfig
  /** Analytics provider configuration. Leave undefined to disable analytics. */
  analytics?: AnalyticsConfig
  /** Doc versions for the version switcher. Leave undefined or empty to hide the switcher. */
  versions?: Array<DocVersion>
}

const brandPresets: Record<BrandPresetKey, BrandConfig> = {
  // Soot and pale lime palette (dealer seed: 2091910182)
  primary: {
    light: {
      background: '#FCFCF9',
      card: '#FFFFFF',
      foreground: '#121212',
      muted: '#F0F0EA',
      mutedForeground: '#595959',
      border: '#E2E2DC',
      accent: '#2A5A1E',
      accentForeground: '#FFFFFF',
      accent2: '#4B5563',
      accent2Foreground: '#FFFFFF',
      input: '#E2E2DC',
      sidebar: '#F7F7F2',
      ring: '#2A5A1E',
      sidebarActiveBg: '95 30% 90% / 0.7',
      sidebarActiveText: '#1F4E15',
    },
    dark: {
      background: '#0F0F0F',
      card: '#1A1A1A',
      foreground: '#FFFFFF',
      muted: '#1F1F1F',
      mutedForeground: '#A3A3A3',
      border: '#262626',
      accent: '#DAFA9C',
      accentForeground: '#0F0F0F',
      accent2: '#E2E8F0',
      accent2Foreground: '#0F0F0F',
      input: '#262626',
      sidebar: '#121212',
      ring: '#DAFA9C',
      sidebarActiveBg: '80 30% 12%',
      sidebarActiveText: '#DAFA9C',
    },
  },
  // Alternate preset — violet. Still a first-class, ready-to-use accent.
  secondary: {
    light: {
      background: '#FFFFFF',
      foreground: '#0F172A',
      muted: '#F5F3FF',
      border: '#E4E4F7',
      accent: '#8B5CF6',
      accentForeground: '#F5F3FF',
      ring: '#A855F7',
      sidebarActiveBg: '262 83% 90% / 0.5',
      sidebarActiveText: '#312E81',
    },
    dark: {
      background: '#070B14',
      foreground: '#EDE9FE',
      muted: '#141129',
      border: '#1C1A2C',
      accent: '#C084FC',
      accentForeground: '#0B1220',
      ring: '#C084FC',
      sidebarActiveBg: '262 45% 32% / 0.3',
      sidebarActiveText: '#EDE9FE',
    },
  },
}

const brandPreset: BrandPresetKey = 'primary'

export const siteConfig: SiteConfig = {
  name: 'JSON Server Field Guide',
  description:
    'An unofficial, example-driven companion for json-server@1.0.0-beta.15. Every claim is backed by a recorded fixture.',
  repoUrl: 'https://github.com/Ebendttl/json-server-field-guide',
  links: [
    { label: 'Quickstart', href: '/quickstart' },
    { label: 'Verification', href: '/verification' },
  ],
  brand: brandPresets[brandPreset],
  brandPreset,
  brandPresets,
}
