import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = () => {
    // For web compatibility, directly logout without confirmation
    // In a real app, you might want to use a custom confirmation modal
    logout();
    showToast('Đã đăng xuất', 'info');
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
    todayAppointments: 5,
  };

  // Mock appointments data - Lịch hẹn hôm nay và sắp tới
  const todayAppointments = [
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      appointmentDate: new Date().toISOString(),
      content: 'Làm tiếp răng số 6, làm tiếp răng số 7',
      status: 'scheduled' as const,
      phone: '0901234567',
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Tái khám sau điều trị',
      status: 'scheduled' as const,
      phone: '0907654321',
    },
    {
      id: '3',
      patientName: 'Lê Văn C',
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Kiểm tra sau niềng răng',
      status: 'scheduled' as const,
      phone: '0912345678',
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
              <Ionicons name="calendar-outline" size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.todayAppointments}</Text>
            <Text style={styles.statLabel}>Lịch hẹn hôm nay</Text>
          </Card>
        </View>

        {/* Today's Appointments */}
        <Card style={styles.recentCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch hẹn</Text>
            <TouchableOpacity
              onPress={() => router.push('/appointments')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {todayAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>Không có lịch hẹn nào</Text>
            </View>
          ) : (
            todayAppointments.map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentItem}
                onPress={() => router.push(`/appointments/${appointment.id}`)}
              >
                <View style={styles.appointmentInfo}>
                  <View style={styles.appointmentHeader}>
                    <Text style={styles.appointmentPatientName}>{appointment.patientName}</Text>
                    <StatusChip
                      label={appointment.status === 'scheduled' ? 'Đã hẹn' : 'Hoàn thành'}
                      status={appointment.status === 'scheduled' ? 'info' : 'success'}
                    />
                  </View>
                  <Text style={styles.appointmentDate}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />{' '}
                    {formatDate(appointment.appointmentDate)}
                  </Text>
                  {appointment.content && (
                    <Text style={styles.appointmentContent} numberOfLines={1}>
                      {appointment.content}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  appointmentPatientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  appointmentDate: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  appointmentContent: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
});
