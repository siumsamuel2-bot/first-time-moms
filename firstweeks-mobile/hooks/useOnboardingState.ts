import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export function useOnboardingState() {
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
        setIsComplete(value === 'true');
      } catch {
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const markComplete = async () => {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true');
    setIsComplete(true);
  };

  const reset = async () => {
    await SecureStore.deleteItemAsync(ONBOARDING_COMPLETE_KEY);
    setIsComplete(false);
  };

  return { isComplete, loading, markComplete, reset };
}