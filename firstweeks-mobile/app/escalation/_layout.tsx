import { Stack } from 'expo-router';

export default function EscalationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="nudge" options={{ title: 'Check-in Complete' }} />
      <Stack.Screen name="reflection" options={{ title: 'How Are You?' }} />
      <Stack.Screen name="reflection-result" options={{ title: 'Recommendation' }} />
      <Stack.Screen name="referral" options={{ title: 'Find Support' }} />
      <Stack.Screen name="referral-sent" options={{ title: 'Referral Sent' }} />
      <Stack.Screen name="consent" options={{ title: 'Share with Clinician' }} />
      <Stack.Screen name="clinician-notified" options={{ title: 'Clinician Notified' }} />
      <Stack.Screen name="crisis" options={{ title: 'Support Resources' }} />
      <Stack.Screen name="reassurance" options={{ title: 'Thank You' }} />
    </Stack>
  );
}
