import { Stack } from 'expo-router';
import { Providers } from './providers';

export default function Layout() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Firstweeks' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
        <Stack.Screen name="check-in" options={{ title: 'Daily Check-in' }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="escalation" options={{ title: 'Escalation Prototype' }} />
      </Stack>
    </Providers>
  );
}