import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { escalationColors, bannerStyles, type AlertBannerStyle } from './constants';
import { Button } from '../Button';

interface AlertBannerProps {
  tier: 'mild' | 'moderate' | 'significant';
  headline: string;
  body: string;
  ctaLabel: string;
  onCtaPress: () => void;
  onDismiss?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  showClinicianNote?: boolean;
}

export function AlertBanner({
  tier,
  headline,
  body,
  ctaLabel,
  onCtaPress,
  onDismiss,
  secondaryLabel,
  onSecondaryPress,
  showClinicianNote,
}: AlertBannerProps) {
  const s = (bannerStyles[tier] || bannerStyles.mild) as AlertBannerStyle;

  return (
    <View style={[styles.container, { backgroundColor: s.bg, borderColor: s.border }]}>
      <View style={styles.headerRow}>
        <Text style={styles.iconText}>{s.icon}</Text>
        <View style={styles.contentArea}>
          <Text style={[styles.headlineText, { color: s.headline }]}>{headline}</Text>
          <Text style={[styles.bodyText, { color: s.body }]}>{body}</Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn} accessibilityLabel="Dismiss notification">
            <Text style={{ fontSize: 18, color: escalationColors.slate[200] }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.actionRow}>
        <Button variant="primary" size="sm" onPress={onCtaPress}>
          {ctaLabel}
        </Button>
        {secondaryLabel && onSecondaryPress && (
          <TouchableOpacity onPress={onSecondaryPress} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>{secondaryLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
      {showClinicianNote && (
        <Text style={styles.clinicianNote}>A clinician has been notified</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconText: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  contentArea: {
    flex: 1,
  },
  headlineText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  dismissBtn: {
    padding: 6,
    marginLeft: 8,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  secondaryBtn: {
    paddingVertical: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    color: escalationColors.slate[600],
    textDecorationLine: 'underline',
  },
  clinicianNote: {
    fontSize: 13,
    color: escalationColors.slate[200],
    marginTop: 8,
    textAlign: 'center',
  },
});
