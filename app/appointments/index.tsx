import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import { colors, layout, spacing, typography } from '../../constants/theme';
import { Appointment } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../contexts/ToastContext';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([
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
  ]);

  const today = new Date();
  const isSameDay = (d: string) => {
    const date = new Date(d);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === 'all') return true;
    return apt.status === statusFilter;
  });
  const [rescheduleModal, setRescheduleModal] = useState<{
    visible: boolean;
    id: string | null;
    date: string;
  }>({ visible: false, id: null, date: '' });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
  });

  const summaryToday = useMemo(() => {
    const todayApts = appointments.filter((a) => isSameDay(a.appointmentDate));
    const followUps = todayApts.filter((a) => (a.content || '').toLowerCase().includes('tái'));
    return { todayApts, followUps };
  }, [appointments]);

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleCheckIn = (id: string) => {
    updateStatus(id, 'completed');
    showToast('Đã check-in và hoàn thành lịch hẹn', 'success');
  };

  const openReschedule = (apt: Appointment) => {
    setRescheduleModal({
      visible: true,
      id: apt.id,
      date: formatDate(apt.appointmentDate),
    });
  };

  const applyReschedule = () => {
    if (!rescheduleModal.id) return;
    updateStatus(rescheduleModal.id, 'scheduled');
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleModal.id
          ? { ...a, appointmentDate: rescheduleModal.date }
          : a
      )
    );
    showToast('Đã cập nhật lịch hẹn', 'success');
    setRescheduleModal({ visible: false, id: null, date: '' });
  };

  const cancelReschedule = () => {
    setRescheduleModal({ visible: false, id: null, date: '' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Lịch hẹn</Text>
            <Text style={styles.subtitle}>Quản lý lịch hẹn tái khám</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/appointments/create')}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary box */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Tổng quan hôm nay</Text>
        <Text style={styles.summaryItem}>
          1. Hôm nay có {summaryToday.todayApts.length} lịch hẹn
          {summaryToday.todayApts.length > 0 &&
            ` (${summaryToday.todayApts.map((a) => a.patient?.name).join(', ')})`}
        </Text>
        <Text style={styles.summaryItem}>
          2. Lịch tái khám hôm nay: {summaryToday.followUps.length}{' '}
          {summaryToday.followUps.length > 0 &&
            `(${summaryToday.followUps.map((a) => a.patient?.name).join(', ')})`}
        </Text>
      </Card>

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

              {appointment.status === 'scheduled' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={() => openReschedule(appointment)}
                  >
                    <Ionicons name="calendar-outline" size={18} color={colors.error} />
                    <Text style={styles.leaveButtonText}>Rời lịch hẹn</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.checkinButton}
                    onPress={() => handleCheckIn(appointment.id)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.cardBackground} />
                    <Text style={styles.checkinButtonText}>Check-in</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>

      <Modal
        visible={rescheduleModal.visible}
        transparent
        animationType="slide"
        onRequestClose={cancelReschedule}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rời lịch hẹn</Text>
              <TouchableOpacity onPress={cancelReschedule}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Ngày mới (dd-mm-yyyy)</Text>
              <TextInput
                style={styles.modalInput}
                value={rescheduleModal.date}
                onChangeText={(text) =>
                  setRescheduleModal((p) => ({ ...p, date: text }))
                }
                placeholder="dd-mm-yyyy"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={cancelReschedule}>
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={applyReschedule}>
                  <Text style={styles.modalSaveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
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
  summaryCard: {
    marginHorizontal: layout.screenPadding.mobile,
    marginTop: spacing.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  summaryItem: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  leaveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: `${colors.error}10`,
  },
  leaveButtonText: {
    color: colors.error,
    fontFamily: typography.fontFamily.semiBold,
  },
  checkinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.success,
  },
  checkinButtonText: {
    color: colors.cardBackground,
    fontFamily: typography.fontFamily.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  modalBody: {
    gap: spacing.sm,
  },
  modalLabel: {
    color: colors.textSecondary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  modalCancel: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    color: colors.textPrimary,
  },
  modalSave: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  modalSaveText: {
    color: colors.cardBackground,
    fontFamily: typography.fontFamily.semiBold,
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

