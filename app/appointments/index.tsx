import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { Appointment } from '../../types';
import { formatDate } from '../../utils/formatters';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  // Mock data - replace with actual data fetching
  const appointments: Appointment[] = [
    {
      id: '1',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        createdAt: new Date().toISOString(),
      },
      appointmentDate: new Date().toISOString(),
      content: 'Làm tiếp răng số 6, làm tiếp răng số 7',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      patientId: '2',
      patient: {
        id: '2',
        name: 'Trần Thị B',
        phone: '0907654321',
        createdAt: new Date().toISOString(),
      },
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Tái khám sau điều trị',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      patientId: '3',
      patient: {
        id: '3',
        name: 'Lê Văn C',
        phone: '0912345678',
        createdAt: new Date().toISOString(),
      },
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Kiểm tra sau niềng răng',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      patientId: '1',
      patient: {
        id: '1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        createdAt: new Date().toISOString(),
      },
      appointmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Đã hoàn thành điều trị',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === 'all') return true;
    return apt.status === statusFilter;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lịch hẹn</Text>
          <Text style={styles.subtitle}>Quản lý lịch hẹn tái khám</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/appointments/create')}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              statusFilter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'scheduled' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('scheduled')}
        >
          <Text
            style={[
              styles.filterButtonText,
              statusFilter === 'scheduled' && styles.filterButtonTextActive,
            ]}
          >
            Đã hẹn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'completed' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              statusFilter === 'completed' && styles.filterButtonTextActive,
            ]}
          >
            Hoàn thành
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'cancelled' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('cancelled')}
        >
          <Text
            style={[
              styles.filterButtonText,
              statusFilter === 'cancelled' && styles.filterButtonTextActive,
            ]}
          >
            Đã hủy
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {sortedAppointments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={colors.textTertiary} />
              <Text style={styles.emptyText}>Không có lịch hẹn nào</Text>
            </View>
          </Card>
        ) : (
          sortedAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              style={styles.appointmentCard}
              onPress={() => router.push(`/appointments/${appointment.id}`)}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.patientName}>{appointment.patient?.name || 'N/A'}</Text>
                  <Text style={styles.patientPhone}>{appointment.patient?.phone || 'N/A'}</Text>
                </View>
                <StatusChip
                  label={
                    appointment.status === 'scheduled'
                      ? 'Đã hẹn'
                      : appointment.status === 'completed'
                      ? 'Hoàn thành'
                      : 'Đã hủy'
                  }
                  status={
                    appointment.status === 'scheduled'
                      ? 'info'
                      : appointment.status === 'completed'
                      ? 'success'
                      : 'error'
                  }
                />
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {formatDate(appointment.appointmentDate)}
                  </Text>
                </View>
                {appointment.content && (
                  <View style={styles.detailRow}>
                    <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText} numberOfLines={2}>
                      {appointment.content}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding.mobile,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: typography.title.mobile,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  addButton: {
    padding: spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding.mobile,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  filterButtonTextActive: {
    color: colors.cardBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding.mobile,
    paddingBottom: spacing.xl,
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  patientPhone: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  appointmentDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
});

