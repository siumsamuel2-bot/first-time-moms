# Firstweeks Design System

## Design Philosophy

Firstweeks' visual language communicates **warmth, credibility, and calm**. Every pixel is chosen to reduce anxiety for exhausted new mothers and build trust with clinical providers.

- **Warmth**: Soft curves, warm neutrals, rounded corners, organic shapes
- **Credibility**: Clean typography, consistent spacing, deliberate whitespace
- **Calm**: Muted palette, no alarming reds unless truly critical, gentle micro-animations

## Brand Voice

| Context | Tone | Examples |
|---------|------|----------|
| Onboarding | Warm, welcoming, informative | "Welcome to Firstweeks — your postpartum recovery partner." |
| Daily check-in | Gentle, conversational | "Good morning, Maya. Let's see how you're doing today." |
| Escalation | Calm, supportive, action-oriented | "We've noticed things have been a bit tougher this week. You're not alone." |
| Provider referral | Warm, empowering | "Here are 3 providers near you who specialize in postpartum support." |
| Clinician dashboard | Professional, clear, efficient | "5 patients need attention." |

**Words to avoid:** depression, disorder, warning, danger, alert (in patient-facing UI), abnormal, failed, wrong.

**Words to prefer:** tough week, recovery pattern, support, connection, gentle, noticing, check-in.

## Color Palette

### Primary — Warm Blush
Named "Rose" — communicates warmth without being clinical or cold.

| Token | Hex | Usage |
|-------|-----|-------|
| `rose-50` | `#FFF1F2` | Backgrounds, cards |
| `rose-100` | `#FFE4E6` | Hover states, light fills |
| `rose-200` | `#FECDD3` | Selected states |
| `rose-400` | `#FB7185` | Accent, links |
| `rose-500` | `#F43F5E` | Primary buttons, active states |
| `rose-600` | `#E11D48` | Button hover, focus rings |

### Secondary — Calm Sage
Named "Sage" — grounding, trustworthy, medical-adjacent.

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-50` | `#F0FDF4` | Alert backgrounds, success states |
| `sage-100` | `#DCFCE7` | |
| `sage-400` | `#4ADE80` | Positive indicators |
| `sage-500` | `#22C55E` | Confirmed/appointments |
| `sage-600` | `#16A34A` | |

### Neutrals — Warm Gray
Named "Warm" — softer than true gray, warmer than blue-gray.

| Token | Hex | Usage |
|-------|-----|-------|
| `warm-50` | `#FAFAF9` | Page backgrounds |
| `warm-100` | `#F5F5F4` | Card backgrounds |
| `warm-200` | `#E7E5E4` | Borders, dividers |
| `warm-300` | `#D6D3D1` | Disabled states |
| `warm-500` | `#78716C` | Secondary text |
| `warm-700` | `#44403C` | Body text |
| `warm-900` | `#1C1917` | Headings |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `info` | `#60A5FA` | Informational banners, tooltips |
| `warning` | `#FBBF24` | Medium escalation, attention needed |
| `error` | `#EF4444` | High/critical escalation (clinician-side only) |
| `success` | `#22C55E` | Check-in complete, all clear |

### Accessibility
- All text/background combinations meet WCAG AA (4.5:1 contrast ratio)
- Semantic colors are NOT used for the sole means of conveying information — always paired with text

## Typography

### Font Family
- **Primary**: `Inter` (sans-serif) — clean, highly legible at small sizes, excellent on mobile
- **Numeric**: `Inter` tabular figures for scales, dates, scores

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-xs` | 12px | 400/500 | 16px | Captions, metadata |
| `text-sm` | 14px | 400/500 | 20px | Body text, card descriptions |
| `text-base` | 16px | 400/500 | 24px | Default body |
| `text-lg` | 18px | 500/600 | 28px | Section titles, question text |
| `text-xl` | 20px | 600 | 28px | Screen titles, card headers |
| `text-2xl` | 24px | 600/700 | 32px | Welcome screen heading |
| `text-3xl` | 30px | 700 | 36px | Hero headings |

### Mobile-specific
- Body text never below 16px (prevents zoom-to-read on mobile)
- Touch targets minimum 44x44px

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | |
| `space-2` | 8px | |
| `space-3` | 12px | |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | |
| `space-6` | 24px | Card spacing |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Screen edges |
| `space-12` | 48px | Headers, large sections |
| `space-16` | 64px | |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Inputs, small elements |
| `radius-md` | 10px | Cards, buttons, modals |
| `radius-lg` | 16px | Sheets, large containers |
| `radius-full` | 9999px | Pill buttons, avatars |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Cards on white |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.06)` | Elevated cards, modals |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.08)` | Bottom sheets, overlays |

## Icons

- Use `lucide-react` — consistent 24px stroke-width icons, good coverage of medical + wellness icons
- Preferred icons: Heart, Baby, Moon, Sun, Activity, Calendar, Bell, MessageCircle, Shield, ChevronLeft, Check, Plus

## Micro-interactions

| Interaction | Duration | Easing | Description |
|-------------|----------|--------|-------------|
| Button press | 100ms | ease-out | Scale 1→0.97 |
| Page transition | 250ms | ease-in-out | Fade + slide up 20px |
| Card tap | 150ms | ease-out | Subtle lift (shadow increase) |
| Check-in complete | 400ms | spring (gentle) | Celebration ripple + text reveal |
| Notification in-app | 300ms | ease-out | Slide down from top |
