import type { ViewStyle, TextStyle } from 'react-native';

export const escalationColors = {
  slate: { 50: '#F1F5F9', 100: '#E2E8F0', 200: '#CBD5E1', 600: '#475569', 800: '#1E293B' },
  sage: { 50: '#F0FDF4', 100: '#DCFCE7', 500: '#22C55E' },
  terracotta: { 50: '#FEF2F0', 100: '#FEE2DE', 500: '#E07A5F' },
  amber: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B' },
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 500: '#6366F1' },
  berry: { 50: '#FDF2F8', 100: '#FCE7F3', 500: '#EC4899' },
  crisis: { 50: '#FFF1F2', 100: '#FFE4E6', 600: '#E11D48', icon: '#BE123C' },
  white: '#FFFFFF',
} as const;

export interface AlertBannerStyle {
  bg: string;
  border: string;
  iconColor: string;
  headline: string;
  body: string;
  ctaVariant: 'primary' | 'secondary' | 'ghost';
  icon: string;
}

export const bannerStyles: Record<string, AlertBannerStyle> = {
  mild: {
    bg: escalationColors.amber[50],
    border: escalationColors.amber[100],
    iconColor: escalationColors.amber[500],
    headline: escalationColors.slate[800],
    body: escalationColors.slate[600],
    ctaVariant: 'primary',
    icon: '☀️',
  },
  moderate: {
    bg: escalationColors.terracotta[50],
    border: escalationColors.terracotta[100],
    iconColor: escalationColors.terracotta[500],
    headline: escalationColors.slate[800],
    body: escalationColors.slate[600],
    ctaVariant: 'primary',
    icon: '❤️',
  },
  significant: {
    bg: escalationColors.berry[50],
    border: escalationColors.berry[100],
    iconColor: escalationColors.berry[500],
    headline: escalationColors.slate[800],
    body: escalationColors.slate[600],
    ctaVariant: 'primary',
    icon: '🛡️',
  },
};
