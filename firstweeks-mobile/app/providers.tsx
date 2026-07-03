'use client';

import { SafeAreaProvider } from 'react-native-safe-area-context';

type ProviderProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <SafeAreaProvider>{children as any}</SafeAreaProvider>;
}