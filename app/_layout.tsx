import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const firstSegment = segments[0];
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated and trying to access protected routes
      if (inAuthGroup || (firstSegment && firstSegment !== 'login')) {
        router.replace('/login');
      }
    } else if (isAuthenticated) {
      // Only redirect to tabs if on login page
      if (firstSegment === 'login') {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="examinations/create" />
      <Stack.Screen name="examinations/[id]" />
      <Stack.Screen name="patients/create" />
      <Stack.Screen name="patients/[id]" />
      <Stack.Screen name="patients/[id]/history" />
      <Stack.Screen name="services/create" />
      <Stack.Screen name="services/[id]" />
      <Stack.Screen name="disease-categories/index" />
      <Stack.Screen name="disease-categories/create" />
      <Stack.Screen name="disease-categories/[id]" />
      <Stack.Screen name="expenses/index" />
      <Stack.Screen name="expenses/create" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RootLayoutNav />
      </ToastProvider>
    </AuthProvider>
  );
}
