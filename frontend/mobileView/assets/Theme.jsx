import { StyleSheet } from 'react-native';

// ── Colours ───────────────────────────────────────────────────────────────────
export const colours = {
  primary: '#00daf3', // Cyber Cyan
  background: '#101418', // Deep Slate
  surface: '#1a1f24', // Charcoal Grey
  success: '#10b981', // Emerald Green
  alert: '#ef4444', // Coral Red
  inactive: '#94a3b8', // Slate Blue-Grey
};

// ── Typography ───────────────────────────────────────────────────────────────
export const fonts = {
  headline: 'SpaceGrotesk-Bold',
  body: 'Inter-Regular',
  data: 'Inter-Medium',
};

// ── Shadows / Glows ──────────────────────────────────────────────────────────
// React Native only supports shadowColour/elevation — no CSS box-shadow glow.
// Use these on View components where you want the cyan glow effect.
export const glow = {
  shadowColor: '#00daf3',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 8, // Android
};

export const common = StyleSheet.create({
  // Screens & containers
  screen: {
    flex: 1,
    backgroundColor: colours.background,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 218, 243, 0.08)',
  },
  cardGlow: {
    backgroundColor: colours.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 218, 243, 0.25)',
    ...glow,
  },

  // Typography
  headline: {
    fontFamily: fonts.headline,
    color: colours.primary,
    fontSize: 24,
  },
  subheading: {
    fontFamily: fonts.headline,
    color: '#ffffff',
    fontSize: 16,
  },
  body: {
    fontFamily: fonts.body,
    color: '#ffffff',
    fontSize: 14,
  },
  muted: {
    fontFamily: fonts.body,
    color: colours.inactive,
    fontSize: 13,
  },
  dataLabel: {
    fontFamily: fonts.data,
    color: colours.primary,
    fontSize: 13,
  },

  // Status indicators
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: colours.success,
  },
  dotOffline: {
    backgroundColor: colours.alert,
  },
  dotInactive: {
    backgroundColor: colours.inactive,
  },

  // Graph
  graph: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: colours.background,
  },
});
