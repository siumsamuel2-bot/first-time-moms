import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { escalationColors } from './constants';

interface Provider {
  id: string;
  name: string;
  credentials: string;
  rating: number;
  reviews: number;
  specialties: string[];
  insurance: string[];
  distance: string;
}

interface ProviderCardProps {
  provider: Provider;
  onRequestContact: (providerId: string) => void;
  onViewDetails: (providerId: string) => void;
  requestSent?: boolean;
}

export function ProviderCard({ provider, onRequestContact, onViewDetails, requestSent }: ProviderCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewDetails(provider.id)}
      accessibilityLabel={`Provider: ${provider.name}`}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{provider.name.charAt(0)}</Text>
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerCreds}>{provider.credentials}</Text>
          <Text style={styles.providerRating}>
            {'★'.repeat(Math.floor(provider.rating))}{'☆'.repeat(5 - Math.floor(provider.rating))}
            {' '}({provider.reviews} reviews)
          </Text>
        </View>
      </View>
      <View style={styles.specialtyRow}>
        {provider.specialties.map((s, i) => (
          <View key={i} style={styles.specialtyBadge}>
            <Text style={styles.specialtyText}>{s}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.insuranceText}>
        Accepts {provider.insurance.join(', ')}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.distanceText}>📍 {provider.distance}</Text>
        <TouchableOpacity
          style={[styles.requestBtn, requestSent && styles.requestBtnSent]}
          onPress={() => onRequestContact(provider.id)}
          disabled={requestSent}
        >
          <Text style={[styles.requestBtnText, requestSent && styles.requestBtnSentText]}>
            {requestSent ? 'Request sent ✓' : 'Request Contact'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: escalationColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: escalationColors.indigo[100],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: escalationColors.indigo[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: escalationColors.indigo[500],
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: escalationColors.slate[800],
  },
  providerCreds: {
    fontSize: 13,
    color: escalationColors.slate[600],
    marginTop: 1,
  },
  providerRating: {
    fontSize: 13,
    color: escalationColors.amber[500],
    marginTop: 2,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  specialtyBadge: {
    backgroundColor: escalationColors.indigo[50],
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  specialtyText: {
    fontSize: 12,
    color: escalationColors.indigo[500],
  },
  insuranceText: {
    fontSize: 13,
    color: escalationColors.slate[600],
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: escalationColors.slate[600],
  },
  requestBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  requestBtnSent: {
    backgroundColor: escalationColors.sage[100],
  },
  requestBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: escalationColors.white,
  },
  requestBtnSentText: {
    color: escalationColors.sage[500],
  },
});
