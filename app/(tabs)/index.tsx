import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'staff':
        return 'Nhân viên';
      case 'dentist':
        return 'Bác sĩ';
      default:
        return 'Người dùng';
    }
  };
  // Mock data - replace with actual data fetching
  const stats = {
    todayPatients: 12,
    todayRevenue: 2500000,
    totalPatients: 156,
    totalExaminations: 342,
  };

  const recentExaminations = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      date: new Date().toISOString(),
      totalCost: 500000,
      status: 'completed' as const,
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      date: new Date().toISOString(),
      totalCost: 750000,
      status: 'pending' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tổng quan</Text>
          <Text style={styles.subtitle}>{formatDate(new Date())}</Text>
        </View>
        <View style={styles.headerRight}>
          {user && (
            <View style={styles.userInfo}>
              <StatusChip
                label={getRoleLabel(user.role)}
                status={user.role === 'admin' ? 'info' : 'success'}
              />
              <Text style={styles.userName}>{user.name}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.todayPatients}</Text>
            <Text style={styles.statLabel}>Bệnh nhân hôm nay</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cash-outline" size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{formatCurrency(stats.todayRevenue)}</Text>
            <Text style={styles.statLabel}>Doanh thu hôm nay</Text>
          </Card>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="person-outline" size={24} color={colors.info} />
            </View>
            <Text style={styles.statValue}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Tổng bệnh nhân</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="document-text-outline" size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.totalExaminations}</Text>
            <Text style={styles.statLabel}>Tổng khám bệnh</Text>
          </Card>
        </View>

        {/* Recent Examinations */}
        <Card style={styles.recentCard}>
          <Text style={styles.sectionTitle}>Khám bệnh gần đây</Text>
          {recentExaminations.map((exam) => (
            <View key={exam.id} style={styles.examItem}>
              <View style={styles.examInfo}>
                <Text style={styles.examPatientName}>{exam.patientName}</Text>
                <Text style={styles.examDate}>{formatDate(exam.date)}</Text>
              </View>
              <View style={styles.examRight}>
                <Text style={styles.examCost}>{formatCurrency(exam.totalCost)}</Text>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        exam.status === 'completed' ? colors.success : colors.warning,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding.mobile,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  logoutButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.title.mobile,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentCard: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  examItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  examInfo: {
    flex: 1,
  },
  examPatientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  examDate: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  examRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  examCost: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
