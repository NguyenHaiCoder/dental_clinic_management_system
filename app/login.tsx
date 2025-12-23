import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Input from '../components/Input';
import { borderRadius, colors, shadows, spacing, typography } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      // Redirect to dashboard
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isDesktop ? (
            // Desktop Layout
            <View style={styles.desktopContainer}>
              {/* Left Side - Medical Illustration */}
              <View style={styles.leftPanel}>
                <LinearGradient
                  colors={[colors.primary, colors.info]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.illustrationContainer}>
                    <View style={styles.medicalIcon}>
                      <Ionicons name="medical" size={120} color="#FFFFFF" />
                    </View>
                    <View style={styles.decorativeCircle1} />
                    <View style={styles.decorativeCircle2} />
                    <View style={styles.decorativeCircle3} />
                  </View>
                  <View style={styles.leftContent}>
                    <Text style={styles.systemTitle}>Hệ thống Quản lý</Text>
                    <Text style={styles.systemSubtitle}>Phòng Khám Nha Khoa</Text>
                    <View style={styles.divider} />
                    <Text style={styles.systemDescription}>
                      Quản lý khám bệnh – Doanh thu – Chi phí một cách hiệu quả
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Right Side - Login Form */}
              <View style={styles.rightPanel}>
                <View style={styles.loginCard}>
                  <View style={styles.loginHeader}>
                    <View style={styles.logoContainer}>
                      <Ionicons name="medical" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.loginTitle}>Đăng nhập</Text>
                    <Text style={styles.loginSubtitle}>
                      Dental Clinic Management System
                    </Text>
                  </View>

                  <View style={styles.formContainer}>
                    <Input
                      label="Tên đăng nhập"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                      leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
                      containerStyle={styles.inputContainer}
                    />

                    <Input
                      label="Mật khẩu"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}
                        >
                          <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textSecondary}
                          />
                        </TouchableOpacity>
                      }
                      containerStyle={styles.inputContainer}
                    />

                    {error ? (
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={16} color={colors.error} />
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    ) : null}

                    <Button
                      title={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      onPress={handleLogin}
                      fullWidth
                      disabled={isLoading}
                      loading={isLoading}
                      style={styles.loginButton}
                    />

                    {/* Demo Credentials Hint */}
                    <View style={styles.demoHint}>
                      <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.demoText}>
                        Demo: admin / admin
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            // Mobile Layout
            <View style={styles.mobileContainer}>
              <LinearGradient
                colors={[colors.primary, colors.info]}
                style={styles.mobileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.mobileHeader}>
                  <View style={styles.mobileLogo}>
                    <Ionicons name="medical" size={64} color="#FFFFFF" />
                  </View>
                  <Text style={styles.mobileTitle}>Hệ thống Quản lý</Text>
                  <Text style={styles.mobileSubtitle}>Phòng Khám Nha Khoa</Text>
                </View>
              </LinearGradient>

              <View style={styles.mobileCard}>
                <View style={styles.loginHeader}>
                  <Text style={styles.loginTitle}>Đăng nhập</Text>
                  <Text style={styles.loginSubtitle}>
                    Dental Clinic Management System
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <Input
                    label="Tên đăng nhập"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
                    containerStyle={styles.inputContainer}
                  />

                  <Input
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    }
                    containerStyle={styles.inputContainer}
                  />

                  {error ? (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={16} color={colors.error} />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <Button
                    title={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    onPress={handleLogin}
                    fullWidth
                    disabled={isLoading}
                    loading={isLoading}
                    style={styles.loginButton}
                  />

                  {/* Demo Credentials Hint */}
                  <View style={styles.demoHint}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.demoText}>
                      Demo: admin / admin
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Desktop Layout
  desktopContainer: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  leftPanel: {
    flex: 1,
    maxWidth: 500,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  illustrationContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalIcon: {
    zIndex: 2,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 20,
    left: 50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    bottom: 40,
    right: 30,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: 150,
    right: 100,
  },
  leftContent: {
    alignItems: 'center',
    marginTop: spacing.xl,
    zIndex: 2,
  },
  systemTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  systemSubtitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.semiBold,
    color: '#FFFFFF',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: colors.secondary,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  systemDescription: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    paddingHorizontal: spacing.lg,
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  // Mobile Layout
  mobileContainer: {
    flex: 1,
  },
  mobileGradient: {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  mobileHeader: {
    alignItems: 'center',
  },
  mobileLogo: {
    marginBottom: spacing.md,
  },
  mobileTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  mobileSubtitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  mobileCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.lg,
    padding: spacing.xl,
    ...shadows.lg,
  },
  // Common Styles
  loginHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loginTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  loginSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.error}15`,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.error,
  },
  loginButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  demoText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
});
