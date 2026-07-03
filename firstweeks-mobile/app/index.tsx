import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingState } from '@/hooks/useOnboardingState';

export default function IndexScreen() {
  const router = useRouter();
  const { isComplete, loading } = useOnboardingState();

  useEffect(() => {
    if (!loading) {
      router.replace(isComplete ? '/dashboard' : '/onboarding');
    }
  }, [isComplete, loading, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});